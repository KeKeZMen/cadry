import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { UserModule } from '@user/user.module';
import { BranchModule } from '@branch/branch.module';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [UserModule, BranchModule],
})
export class EmployeeModule {}
