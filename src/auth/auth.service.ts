import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserNotFoundException } from './exception/userNotFound..exception';
import { WrongPasswordException } from './exception/wrongPassword.exception';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtPayloadDto } from './dto/jwt.dto';
import { JwtDecodePayloadDto } from './dto/jwtDecode.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { ConfigType } from '@nestjs/config';
import jwtConfig, {
  refreshTokenName,
  tokenConfiguration,
  tokenName,
} from './configuration/constants.configuration';
import { HashingService } from './hashing/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly _jwtService: JwtService,
    private readonly _hashingService: HashingService,
  ) {}

  public async login(req: Request, res: Response, credential: LoginDto) {
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

    const token = this.generateToken(tokenPayload);
    req.user = tokenPayload;
    res.cookie(tokenName, token, tokenConfiguration);

    const refreshTokenPayload: JwtPayloadDto = {
      userId: userIsValid.data.id,
      role: userIsValid.data.role,
    };
    const refreshToken = this.generateToken(
      refreshTokenPayload,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    res
      .cookie(refreshTokenName, refreshToken, tokenConfiguration)
      .send({ token, refreshToken })
      .end();
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
      throw new WrongPasswordException();
    }

    return {
      success: true,
      data: user,
    };
  }

  public generateToken(
    payload: JwtPayloadDto,
    expiresIn?: string | number | undefined,
  ) {
    return this._jwtService.sign(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: expiresIn ?? this.jwtConfiguration.jwtTtl,
    });
  }

  public verifyTokenPayload(token: string, ignoreExpiration?: boolean) {
    try {
      const decoded: JwtDecodePayloadDto = this._jwtService.verify(token, {
        secret: this.jwtConfiguration.secret,
        ignoreExpiration,
      });
      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expirado');
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException('Token não encontrado');
      console.log(error);
    }
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
