import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt_secret,
    });
  }

  validate(payload: {
    sub: UserEntity['id'];
    username: UserEntity['username'];
  }) {
    return { userId: payload.sub, username: payload.username };
  }
}
