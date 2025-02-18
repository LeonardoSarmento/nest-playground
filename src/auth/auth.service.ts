import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserNotFoundException } from './exception/userNotFound..exception';
import { WrongPasswordException } from './exception/wrongPassword.exception';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import configuration from 'src/config/configuration';
import { JwtPayloadDto } from './dto/jwt.dto';
import { JwtDecodePayloadDto } from './dto/jwtDecode.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  public async validateUser(
    username: UserEntity['username'],
    password: UserEntity['password'],
  ) {
    const user = await this._userService.findByUnique({ username: username });

    if (!user) throw new UserNotFoundException();

    if (!bcrypt.compareSync(password, user.password)) {
      throw new WrongPasswordException();
    }

    return {
      success: true,
      data: user,
    };
  }

  public generateToken(payload: JwtPayloadDto) {
    return this._jwtService.sign(payload, {
      secret: configuration().jwt_secret,
      expiresIn: '10min',
    });
  }

  public generateRefreshToken(payload: JwtPayloadDto) {
    return this._jwtService.sign(payload, {
      secret: configuration().jwt_secret,
      expiresIn: '60min',
    });
  }

  public verifyTokenPayload(token: string, ignoreExpiration?: boolean) {
    try {
      const decoded: JwtDecodePayloadDto = this._jwtService.verify(token, {
        secret: configuration().jwt_secret,
        ignoreExpiration,
      });
      return decoded;
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        throw new UnauthorizedException('Token não encontrado');
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedException('Token expirado');
      console.log(error);
    }
  }

  public decodeToken(token: string): JwtDecodePayloadDto {
    return this._jwtService.decode(token);
  }

  public tokenIsExpiredButValid(token: string) {
    try {
      this._jwtService.verify(token, {
        secret: configuration().jwt_secret,
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
