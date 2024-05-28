import { Role } from '@prisma/client';

export class CreateUserDto {
  firstName: string;
  secondName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  repeatPassword: string;
  branchId: string | null;
  role: Role;
}
