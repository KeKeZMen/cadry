import { IJwtPayload } from "@auth/interfaces";
import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
  (
    key: keyof IJwtPayload,
    ctx: ExecutionContext
  ): IJwtPayload | Partial<IJwtPayload> => {
    const req = ctx.switchToHttp().getRequest() as Request;
    return key ? req.user[key] : req.user;
  }
);
