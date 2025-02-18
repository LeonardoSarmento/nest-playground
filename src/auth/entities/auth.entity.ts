import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty({ type: String })
  token: string;
  @ApiProperty({ type: String })
  refreshToken: string;
}
