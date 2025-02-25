import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { Roles } from './decorators/roles.decorator';
import { USER_ROLE_CODE as ROLES } from '../user/enums/role.enum';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { AuthEntity } from './entities/auth.entity';
import {
  refreshTokenName,
  tokenConfiguration,
  tokenName,
} from './configuration/constants.configuration';
import { UserEntity } from '../user/entities/user.entity';
import { JwtDecodePayloadDto } from './dto/jwtDecode.dto';
import { TokenPayloadParam } from './params/token-payload.param';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly _service: AuthService,
    private readonly _userService: UserService,
  ) {}

  @Public()
  @ApiOkResponse({ type: AuthEntity })
  @Post('/login')
  async login(@Res() res: Response, @Body() credential: LoginDto) {
    const response = await this._service.login(res, credential);
    res.send(response).end();
  }

  @Public()
  @Post('/logout')
  public logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(tokenName, tokenConfiguration);
    res.clearCookie(refreshTokenName, tokenConfiguration);
    res.status(204);
    return;
  }

  @Post('/refreshToken')
  @ApiOkResponse({ type: AuthEntity })
  async refreshToken(
    @TokenPayloadParam(refreshTokenName) refreshToken: string,
    @Res() res: Response,
  ) {
    const response = await this._service.refreshToken(res, refreshToken);
    res.send(response).end();
  }

  @Get('/profile')
  @ApiOkResponse({ type: UserEntity })
  @Roles([ROLES.ADMIN, ROLES.USER])
  public async getProfile(@TokenPayloadParam() token: string) {
    const { userId } = await this._service.verifyTokenPayload(token);
    return await this._userService.findByUnique({ id: userId });
  }

  @Roles([ROLES.ADMIN, ROLES.USER])
  @ApiOkResponse({ type: JwtDecodePayloadDto })
  @Get('/token')
  public getCurrentProfile(@Req() req: Request) {
    const token = req.cookies[tokenName] as string;
    return this._service.verifyTokenPayload(token);
  }
}
