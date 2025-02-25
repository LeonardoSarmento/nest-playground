import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import {
  refreshTokenName,
  tokenName,
} from '../configuration/constants.configuration';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private _authService: AuthService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse<Response>();

    const token = this.extractTokenFromHeader(request, tokenName);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      await this._authService.verifyTokenPayload(token);
      return true;
    } catch (error) {
      if (this.isJwtError(error)) {
        if (error.name === 'UnauthorizedException' && error.status === 401) {
          const refreshToken = this.extractTokenFromHeader(
            request,
            refreshTokenName,
          );

          await this._authService.refreshToken(response, refreshToken);

          return true;
        }
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Token inválido');
        }
      }
      throw new UnauthorizedException('Erro desconhecido na autenticação');
    }
  }

  private extractTokenFromHeader(request: Request, tokenName: string): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    let req_token = type === 'Bearer' ? token : undefined;

    if (!req_token) {
      req_token = request.cookies[tokenName] as string;
    }

    return req_token;
  }

  private isJwtError(
    error: unknown,
  ): error is Error & { name: string; status: number } {
    return typeof error === 'object' && error !== null && 'name' in error;
  }
}
