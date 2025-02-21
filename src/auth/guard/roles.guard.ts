import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { tokenName } from '../configuration/constants.configuration';
import { AuthService } from '../auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private _authService: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();

    const authtoken = req.cookies[tokenName] as string;

    if (!authtoken) throw new UnauthorizedException('Token não encontrado');

    let authResult: boolean = false;

    const JwtPayload = await this._authService.verifyTokenPayload(authtoken);
    authResult = requiredRoles.some((role) => JwtPayload?.role === role);

    if (authResult === false)
      throw new ForbiddenException('Nível de cargo não autorizado');

    return true;
  }
}
