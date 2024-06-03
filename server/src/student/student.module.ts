import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UserModule } from '@user/user.module';
import { OrganizationModule } from '@organization/organization.module';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [UserModule, OrganizationModule],
})
export class StudentModule {}
