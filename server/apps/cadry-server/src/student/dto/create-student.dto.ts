import { Gender } from '@prisma/client';

type SubProfessionType = {
  id: string;
  category: string;
};
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
  professionId: number;
  gpa: number;
  socialAdaptability: number;
  subProfessions: SubProfessionType[];
}
