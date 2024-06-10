import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { CreateWorkProfessionDto } from './dto/create-work-profession.dto';
import { UpdateWorkProfessionDto } from './dto/update-work-profession.dto';

@Injectable()
export class WorkProfessionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createWorkProfessionDto: Partial<CreateWorkProfessionDto>) {
    return this.databaseService.workProfession.create({
      data: {
        name: createWorkProfessionDto.name,
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

  findMany() {
    return this.databaseService.workProfession.findMany();
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