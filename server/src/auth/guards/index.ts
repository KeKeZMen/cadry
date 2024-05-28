import { JwtGuard } from "./jwt.guard";
import { RolesGuard } from "./roles.guards";

export const GUARDS = [JwtGuard, RolesGuard];
