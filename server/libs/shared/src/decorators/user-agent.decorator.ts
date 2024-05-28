import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { Request } from "express";

export const UserAgent = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    return req.headers["user-agent"];
  }
);
