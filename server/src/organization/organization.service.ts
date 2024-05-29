import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateOrganizationUserDto,
} from './dto';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        ...createOrganizationDto,
      },
    });
  }

  createOrganizationViaUser(
    createOrganizationUserDto: CreateOrganizationUserDto,
  ) {
    return this.prisma.organization.create({
      data: {
        ...createOrganizationUserDto,
        type: 'Organization',
      },
    });
  }

  findOneByIdOrInn(idOrInn: string) {
    return this.prisma.organization.findFirst({
      where: {
        OR: [{ id: idOrInn }, { inn: idOrInn }],
      },
    });
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.prisma.organization.update({
      where: {
        id,
      },
      data: {
        ...updateOrganizationDto,
      },
    });
  }

  remove(id: string) {
    return this.prisma.organization.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
