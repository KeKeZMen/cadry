import { EmployeeType } from '@prisma/client';
import { CreateUserDto } from '@user/dto';

export class CreateEmployeeDto extends CreateUserDto {
  branchId: string;
  employeeType: EmployeeType;
}
