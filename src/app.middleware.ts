import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger('HTTP');

    const startAt = process.hrtime();
    const { method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      logger.log(
        `${method} ${originalUrl} ${statusCode} ${responseTime.toPrecision(4)}ms`,
      );
    });

    if (next) {
      next();
    }
  }
}
