import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUserDto } from '../dto/request-user.dto';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUserDto }>();
    return request.user;
  },
);
