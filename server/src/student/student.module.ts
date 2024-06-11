import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UserModule } from '@user/user.module';
import { OrganizationModule } from '@organization/organization.module';
import { WorkProfessionModule } from '@work-profession/work-profession.module';
import { DatabaseModule } from '@database/database.module';
import { IsActiveGuard } from './guards/IsActive.guard';

@Module({
  controllers: [StudentController],
  providers: [StudentService, IsActiveGuard],
  imports: [
    DatabaseModule,
    UserModule,
    OrganizationModule,
    WorkProfessionModule,
  ],
  exports: [StudentService],
})
export class StudentModule {}
