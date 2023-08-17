
import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const GetUser = createParamDecorator(
    (field: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        if (field) {
            return request.user[field];
        }
        return request.user;
    },
);
