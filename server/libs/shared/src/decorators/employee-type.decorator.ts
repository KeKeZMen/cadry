import { SetMetadata } from '@nestjs/common';
import { EmployeeType } from '@prisma/client';

export const TYPES_KEY = 'employee_type';
export const EmployeeTypes = (...roles: EmployeeType[]) =>
  SetMetadata(TYPES_KEY, roles);
