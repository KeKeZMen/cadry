import { OrganizationType } from '@prisma/client';

export class CreateOrganizationDto {
  name: string;
  phoneNumber: string;
  email: string;
  web: string;
  address: string;
  inn: string;
  type: OrganizationType;
}
