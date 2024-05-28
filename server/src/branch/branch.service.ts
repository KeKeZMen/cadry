import { Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from './dto';
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
