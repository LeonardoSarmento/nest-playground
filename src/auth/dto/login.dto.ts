import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';

export class LoginDto {
  @ApiProperty({ type: String })
  username: UserEntity['username'];

  @ApiProperty({ type: String })
  password: UserEntity['password'];
}
