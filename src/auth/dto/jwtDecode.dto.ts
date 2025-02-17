import { ApiProperty } from '@nestjs/swagger';
import { JwtPayloadDto } from './jwt.dto';

export class JwtDecodePayloadDto extends JwtPayloadDto {
  @ApiProperty({ type: Number })
  iat: number;

  @ApiProperty({ type: Number })
  exp: number;
}
