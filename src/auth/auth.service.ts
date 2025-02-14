import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly _userService: UserService) {}

  async validateUser(
    username: UserEntity['username'],
    password: UserEntity['password'],
  ) {
    const user = await this._userService.findByUnique({ username });
  }
}
