import { All, Controller, Get, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';
import configuration from './config/configuration';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('/')
  @ApiExcludeEndpoint()
  index(@Req() req: Request, @Res() res: Response) {
    const APP_BASENAME = configuration().app_basename;
    return res.status(302).redirect(`${APP_BASENAME}/swagger`);
  }

  @Get('/health')
  public checkHealth(@Req() req: Request, @Res() res: Response) {
    return res.status(200).send('OK 👍 (*-*) 👍');
  }
}
