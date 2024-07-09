import { Injectable } from '@nestjs/common';
import { CreateWorkProfessionDto } from './dto/create-work-profession.dto';
import { UpdateWorkProfessionDto } from './dto/update-work-profession.dto';
import { DatabaseService } from '@libs/database';

@Injectable()
export class WorkProfessionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createWorkProfessionDto: Partial<CreateWorkProfessionDto>) {
    return this.databaseService.workProfession.create({
      data: {
        name: createWorkProfessionDto.name,
        category: createWorkProfessionDto.category,
      },
    });
  }

  findOneById(id: number) {
    return this.databaseService.workProfession.findFirst({
      where: {
        id,
      },
    });
  }

  findOneByName(name: string) {
    return this.databaseService.workProfession.findFirst({
      where: {
        name,
      },
    });
  }

  findMany() {
    return this.databaseService.workProfession.findMany();
  }

  findManyBySpecialityId(specialityId: number) {
    return this.databaseService.workProfessionToSpeciality.findMany({
      where: {
        specialityId,
      },
      select: {
        workProfession: true,
      },
    });
  }

  update(id: number, updateProfessionDto: UpdateWorkProfessionDto) {
    return this.databaseService.workProfession.update({
      where: {
        id,
      },
      data: {
        name: updateProfessionDto.name,
      },
    });
  }

  remove(id: number) {
    return this.databaseService.workProfession.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
