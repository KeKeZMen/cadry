import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { PrismaModule } from '@prisma/prisma.module';
import { UserModule } from '@user/user.module';
import { BranchModule } from '@branch/branch.module';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [PrismaModule, UserModule, BranchModule],
  exports: [OrganizationService],
})
export class OrganizationModule {}
