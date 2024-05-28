import { AuthModule } from '@auth/auth.module';
import { BranchModule } from '@branch/branch.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
})
export class AppModule {}
