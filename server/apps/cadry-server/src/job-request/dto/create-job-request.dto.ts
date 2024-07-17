export class CreateJobRequestDto {
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
