import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { Request } from "express";

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    return key && key in req.cookies
      ? req.cookies[key]
      : key
        ? null
        : req.cookies;
  }
);
