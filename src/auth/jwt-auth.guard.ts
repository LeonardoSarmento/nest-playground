import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import configuration from 'src/config/configuration';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private _jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }
    try {
      this._jwtService.verify(token, {
        secret: configuration().jwt_secret,
      });
    } catch (err) {
      if (err instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expirado');

      throw new UnauthorizedException('Erro ao validar Token');
    }
    return super.canActivate(context);
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    let req_token = type === 'Bearer' ? token : undefined;

    if (!req_token) {
      req_token = request.cookies['authtoken'] as string;
    }

    return req_token;
  }
}
