import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { JwtPayloadDto } from './dto/jwt.dto';
import { Roles } from './decorators/roles.decorator';
import { USER_ROLE_CODE as ROLES } from 'src/user/enums/role.enum';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { AuthEntity } from './entities/auth.entity';
import {
  refreshTokenName,
  tokenConfiguration,
  tokenName,
} from './configuration/constants.configuration';

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
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() credential: LoginDto,
  ) {
    return this._service.login(req, res, credential);
  }

  @Post('/logout')
  public logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie(tokenName, tokenConfiguration);
    res.clearCookie(refreshTokenName, tokenConfiguration);
    res.status(204);
    return;
  }

  @Get('/profile')
  @Roles([ROLES.ADMIN, ROLES.USER])
  public async getProfile(@Req() req: Request) {
    const tokenPayload = this._service.verifyTokenPayload(
      req.cookies[tokenName] as string,
    );
    console.debug('tokenPayload', tokenPayload);
    return await this._userService.findByUnique({ id: tokenPayload?.userId });
  }

  @Roles([ROLES.ADMIN, ROLES.USER])
  @Get('/token')
  public getCurrentProfile(@Req() req: Request) {
    const token = req.cookies[tokenName] as string;
    return this._service.verifyTokenPayload(token);
  }
}
