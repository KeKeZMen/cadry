import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { UserModule } from '@user/user.module';
import { BranchModule } from '@branch/branch.module';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [UserModule, BranchModule],
  exports: [OrganizationService],
})
export class OrganizationModule {}
