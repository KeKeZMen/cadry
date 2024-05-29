import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateOrganizationUserDto,
} from './dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly database: DatabaseService) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.database.organization.create({
      data: {
        ...createOrganizationDto,
      },
    });
  }

  createOrganizationViaUser(
    createOrganizationUserDto: CreateOrganizationUserDto,
  ) {
    return this.database.organization.create({
      data: {
        ...createOrganizationUserDto,
        type: 'Organization',
      },
    });
  }

  findOneByIdOrInn(idOrInn: string) {
    return this.database.organization.findFirst({
      where: {
        OR: [{ id: idOrInn }, { inn: idOrInn }],
      },
    });
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.database.organization.update({
      where: {
        id,
      },
      data: {
        ...updateOrganizationDto,
      },
      select: {
        id: true,
      },
    });
  }

  remove(id: string) {
    return this.database.organization.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
