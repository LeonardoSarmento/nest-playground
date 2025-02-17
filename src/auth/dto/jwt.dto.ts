import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';

export class JwtPayloadDto {
  @ApiProperty({ type: String })
  userId: UserEntity['id'];

  @ApiProperty({ type: String })
  role: UserEntity['role'];
}
