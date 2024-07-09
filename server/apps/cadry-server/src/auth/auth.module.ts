import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "@user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { options } from "./config";
import { GUARDS } from "./guards";
import { STRATEGIES } from "./strategies";
import { OrganizationModule } from "@organization/organization.module";
import { RmqModule } from "@libs/rmq";

@Module({
  controllers: [AuthController],
  providers: [AuthService, ...STRATEGIES, ...GUARDS],
  imports: [
    PassportModule,
    JwtModule.registerAsync(options()),
    UserModule,
    OrganizationModule,
    RmqModule
  ],
})
export class AuthModule {}
