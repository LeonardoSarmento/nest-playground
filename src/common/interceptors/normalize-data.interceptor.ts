import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, map } from 'rxjs';

interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class NormalizeResponseInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> {
    const ctx = context.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((result) => {
        let message = 'Success';
        let data: T;

        if (result && typeof result === 'object' && 'message' in result) {
          message = result.message as string;
        }

        if (result && typeof result === 'object' && 'data' in result) {
          data = result.data as T;
        } else {
          data = result;
        }

        return {
          statusCode,
          message,
          data,
          path: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
