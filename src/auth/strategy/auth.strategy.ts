import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _authService: AuthService) {
    super();
  }

  public async validate(
    username: UserEntity['username'],
    password: UserEntity['password'],
  ) {
    const user = await this._authService.validateUser(username, password);
    console.debug('user', user);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
