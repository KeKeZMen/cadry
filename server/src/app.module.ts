import { AuthModule } from '@auth/auth.module';
import { JwtGuard } from '@auth/guards/jwt.guard';
import { BranchModule } from '@branch/branch.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { OrganizationModule } from '@organization/organization.module';
import { PrismaModule } from '@prisma/prisma.module';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    UserModule,
    PrismaModule,
    AuthModule,
    OrganizationModule,
    BranchModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
