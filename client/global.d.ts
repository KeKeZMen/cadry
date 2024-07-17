declare interface IUser {
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
