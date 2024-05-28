import { Injectable } from '@nestjs/common';
import {
  CreateBranchDto,
  CreateOrganizationBranchDto,
  UpdateBranchDto,
} from './dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}
  create(createBranchDto: CreateBranchDto) {
    return this.prisma.branch.create({
      data: {
        ...createBranchDto,
      },
    });
  }

  createForOrganization(organizationBranchDto: CreateOrganizationBranchDto) {
    return this.prisma.branch.create({
      data: {
        email: organizationBranchDto.email,
        organizationId: organizationBranchDto.organizationId,
      },
    });
  }

  findManyByOrganizationId(organizationId: string) {
    return this.prisma.branch.findMany({
      where: {
        organizationId,
      },
    });
  }

  update(id: string, updateBranchDto: UpdateBranchDto) {
    return this.prisma.branch.update({
      where: {
        id,
      },
      data: {
        ...updateBranchDto,
      },
    });
  }

  remove(id: string) {
    return this.prisma.branch.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
