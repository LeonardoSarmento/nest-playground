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

const tokenConfiguration = {
  httpOnly: false,
  secure: true,
  sameSite: 'none',
  path: '/',
} as const;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _service: AuthService,
    private readonly _userService: UserService,
  ) {}

  tokenConfiguration = {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    path: '/',
  };

  @Post('/login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() credential: LoginDto,
  ) {
    const userIsValid = await this._service.validateUser(
      credential.username,
      credential.password,
    );
    if (!userIsValid.success)
      throw new UnauthorizedException('Error ao validar "Usuário');

    const tokenPayload: JwtPayloadDto = {
      userId: userIsValid.data.id,
      role: userIsValid.data.role,
    };

    const token = this._service.generateToken(tokenPayload);
    req.user = tokenPayload;
    res.cookie('authToken', token, tokenConfiguration).send({ token }).end();

    const refreshTokenPayload: JwtPayloadDto = {
      userId: userIsValid.data.id,
      role: userIsValid.data.role,
    };
    const refreshToken =
      this._service.generateRefreshToken(refreshTokenPayload);

    res
      .cookie('authRefreshToken', refreshToken, tokenConfiguration)
      .send({ refreshToken })
      .end();
  }

  @Post('/logout')
  public logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('authToken', tokenConfiguration);
    res.clearCookie('authRefreshToken', tokenConfiguration);
    res.status(204);
    return;
  }

  @Get('/profile')
  public async getProfile(@Req() req: Request) {
    const tokenPayload = this._service.verifyTokenPayload(
      req.cookies['authToken'] as string,
    );
    return await this._userService.findByUnique({ id: tokenPayload?.userId });
  }

  @Roles([ROLES.ADMIN, ROLES.USER])
  @Get('/token')
  public getCurrentProfile(@Req() req: Request) {
    const token = req.cookies['authToken'] as string;
    return this._service.verifyTokenPayload(token);
  }
}
