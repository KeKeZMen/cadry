import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { BranchModule } from '@branch/branch.module';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { WorkProfessionModule } from '@work-profession/work-profession.module';
import { SpecialityModule } from '@speciality/speciality.module';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  imports: [UserModule, BranchModule, WorkProfessionModule, SpecialityModule],
  exports: [OrganizationService],
})
export class OrganizationModule {}
