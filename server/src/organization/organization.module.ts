import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { BranchModule } from '@branch/branch.module';
import { DirectionModule } from '@direction/direction.module';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { ProfessionModule } from '@profession/profession.module';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [UserModule, BranchModule, DirectionModule, ProfessionModule],
  exports: [OrganizationService],
})
export class OrganizationModule {}
