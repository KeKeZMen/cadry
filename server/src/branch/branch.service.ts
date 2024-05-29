import { Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class BranchService {
  constructor(private readonly database: DatabaseService) {}

  create(createBranchDto: CreateBranchDto, organizationId: string) {
    return this.database.branch.create({
      data: {
        ...createBranchDto,
        organizationId,
      },
    });
  }

  getOrganizationIdByBranch(id: string) {
    return this.database.organization.findFirst({
      where: {
        branches: {
          some: {
            id,
          },
        },
      },
    });
  }

  findManyByOrganizationId(organizationId: string) {
    return this.database.branch.findMany({
      where: {
        organizationId,
      },
    });
  }

  update(id: string, updateBranchDto: UpdateBranchDto) {
    return this.database.branch.update({
      where: {
        id,
      },
      data: {
        ...updateBranchDto,
      },
      select: {
        id: true,
      },
    });
  }

  remove(id: string) {
    return this.database.branch.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
