import { Gender } from '@prisma/client';

export class CreateStudentDto {
  userId: string;
  firstName: string;
  secondName: string;
  lastName: string;
  birthDate: Date;
  graduateYear: number;
  gender: Gender;
  phoneNumber: string;
  address: string;
  educationOrganizationId: string;
  specialityId: number;
  gpa: number;
  socialAdaptability: number;
  subProfession: number[];
}
