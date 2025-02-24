import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import configuration from '../../config/configuration';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt_secret,
    });
  }

  async validate(payload: {
    sub: UserEntity['id'];
    username: UserEntity['username'];
  }) {
    return Promise.resolve({ userId: payload.sub, username: payload.username });
  }
}
