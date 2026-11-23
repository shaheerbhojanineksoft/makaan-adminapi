import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentAdminPayload = {
  adminId: string;
  email: string;
  type: 'admin';
};

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentAdminPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentAdminPayload }>();
    return request.user;
  },
);
