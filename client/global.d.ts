declare interface IAccount {
  id: string;
  role: string;
  email: string;
}

declare interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

declare interface IJobRequest {
  id: string;
  educationOrganizationId?: string;
  workOrganizationId: string;
  specialityId?: number;
  professionId?: number;
  count: number;
  requestYear?: Date;
  salary: number;
  readyToMove: boolean;
  targetAgreement: boolean;
  isDisability: boolean;
  quotas: boolean;
  description: string;
}

declare interface IOrganization {
  id: string;
  name: string | null;
  phoneNumber: string | null;
  email: string;
  web: string | null;
  address: string | null;
  inn: string;
  description: string | null;
  logoUrl: string | null;
  type: "EducationOrganization" | "Organization";
  userId: string;
}

declare interface IWorkProfession {
  id: number;
  name: string;
  category: string;
}

declare interface ISpeciality {
  id: number;
  key: string;
  directionId: number;
  name: string;
}

declare interface IDirection {
  id: number;
  key: string;
  name: string;
}

declare interface IBranch {
  id: string;
  organizationId: string;
  address?: string;
  phoneNumber?: string;
  email: string;
}

declare interface IStudent {
  userId: string;
  birthDate: Date;
  photoUrl?: string;
  graduateYear: number;
  address: string;
  portfolioUrl?: string;
  readyToMove: boolean;
  subInfo?: string;
  educationOrganizationId: string;
  disability:
    | "visuallyImpaired"
    | "hardHearing"
    | "speechDisorders"
    | "musculoskeletalDisorders"
    | "impairedMental"
    | "intellectualImpairment"
    | "autismDisorder";
  gender: "Man" | "Women";
  isActive: boolean;
  gpa: number;
  socialAdaptability: number;
  professionId: number;
  subProfessions: {
    id: number;
    category: string;
  };
}

declare interface IEmployee {
  userId: string;
  employeeType: "Manager" | "Employment" | "Graduates";
  branchId: string;
}

declare interface IUser {
  id: string;
  firstName?: string;
  secondName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  role: "Admin" | "Student" | "Employee" | "Organization";
}
