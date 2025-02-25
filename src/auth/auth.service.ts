import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { UserNotFoundException } from './exception/user-notFound.exception';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt.dto';
import { JwtDecodePayloadDto } from './dto/jwtDecode.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ConfigType } from '@nestjs/config';
import jwtConfig, {
  refreshTokenName,
  tokenConfiguration,
  tokenName,
} from './configuration/constants.configuration';
import { HashingService } from './hashing/hashing.service';
import { WrongUserLoginException } from './exception/wrong-login.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly _jwtService: JwtService,
    private readonly _hashingService: HashingService,
  ) {}

  public async login(res: Response, credential: LoginDto) {
    const userIsValid = await this.validateUser(
      credential.username,
      credential.password,
    );
    if (!userIsValid.success)
      throw new UnauthorizedException('Error ao validar "Usuário');

    const tokenPayload: JwtPayloadDto = {
      userId: userIsValid.data.id,
      role: userIsValid.data.role,
    };

    return await this.createToken(res, tokenPayload);
  }

  public async refreshToken(res: Response, token: string) {
    const { userId } = await this.verifyTokenPayload(token);

    const user = await this._userService.findByUnique({ id: userId });

    if (!user) throw new UnauthorizedException('Error ao validar "Usuário"');

    const tokenPayload: JwtPayloadDto = {
      userId: user.id,
      role: user.role,
    };

    return await this.createToken(res, tokenPayload);
  }

  public async createToken(res: Response, tokenPayload: JwtPayloadDto) {
    const token = await this.generateToken(tokenPayload);
    res.cookie(tokenName, token, tokenConfiguration);

    const refreshToken = await this.generateToken(
      tokenPayload,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    res.cookie(refreshTokenName, refreshToken, tokenConfiguration);
    return { token, refreshToken };
  }

  public async validateUser(
    username: UserEntity['username'],
    password: UserEntity['password'],
  ) {
    const user = await this._userService.findByUnique({ username: username });

    if (!user) throw new UserNotFoundException();

    const passwordInvalid = await this._hashingService.compare(
      password,
      user.password,
    );

    if (!passwordInvalid) {
      throw new WrongUserLoginException();
    }

    return {
      success: true,
      data: user,
    };
  }

  public async generateToken(
    payload: JwtPayloadDto,
    expiresIn?: string | number,
  ) {
    return await this._jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: expiresIn ? expiresIn : this.jwtConfiguration.jwtTtl,
    });
  }

  public async verifyTokenPayload(token: string, ignoreExpiration?: boolean) {
    try {
      const decoded: JwtDecodePayloadDto = await this._jwtService.verifyAsync(
        token,
        {
          secret: this.jwtConfiguration.secret,
          ignoreExpiration,
        },
      );
      return decoded;
    } catch (error: unknown) {
      if (this.isJwtError(error)) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expirado');
        }
        if (error.name === 'JsonWebTokenError') {
          throw new UnauthorizedException('Token inválido');
        }
      }

      throw new UnauthorizedException('Erro desconhecido na autenticação');
    }
  }

  private isJwtError(error: unknown): error is Error & { name: string } {
    return typeof error === 'object' && error !== null && 'name' in error;
  }

  public decodeToken(token: string): JwtDecodePayloadDto {
    return this._jwtService.decode(token);
  }

  public tokenIsExpiredButValid(token: string) {
    try {
      this._jwtService.verify(token, {
        secret: this.jwtConfiguration.secret,
      });
      return false;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return true;
      } else {
        return false;
      }
    }
  }
}
