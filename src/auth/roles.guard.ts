import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtPayloadDto } from './dto/jwt.dto';
import configuration from '../config/configuration';
import { Roles } from './decorators/roles.decorator';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());

    if (!requiredRoles) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();

    const authtoken = req.cookies['authtoken'] as string;

    if (!authtoken) throw new UnauthorizedException('Token não encontrado');

    let authResult: boolean = false;

    try {
      const JwtPayload: JwtPayloadDto = this.jwtService.verify(authtoken, {
        secret: configuration().jwt_secret,
      });

      authResult = requiredRoles.some((role) => JwtPayload.role == role);
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expirado');
    }
    if (authResult == false)
      throw new ForbiddenException('Cargo não autorizado');

    return true;
  }
}
