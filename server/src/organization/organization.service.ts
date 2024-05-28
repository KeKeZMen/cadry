import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

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

  findOneByIdOrEmail(idOrEmail: string) {
    return this.prisma.organization.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
    });
  }

  findMany() {
    return this.prisma.organization.findMany();
  }

  findManyByName(name: string) {
    return this.prisma.organization.findMany({
      where: {
        name: {
          contains: name,
        },
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
