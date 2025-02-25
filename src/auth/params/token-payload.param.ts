import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { tokenName } from '../configuration/constants.configuration';

export const TokenPayloadParam = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request: Request = context.getRequest();
    return request.cookies[data ? data : tokenName] as string;
  },
);
