import { Injectable } from '@nestjs/common';
import { CreateBranchDto, UpdateBranchDto } from './dto';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class BranchService {
  constructor(private readonly database: DatabaseService) {}
  create(createBranchDto: CreateBranchDto) {
    return this.database.branch.create({
      data: {
        ...createBranchDto,
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
    });
  }

  remove(id: string) {
    return this.database.branch.delete({
      where: {
        id,
      },
    });
  }
}
