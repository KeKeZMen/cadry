import { Injectable } from '@nestjs/common';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { AddWorkProfessionDto } from './dto/add-work-profession.dto';
import { DatabaseService } from '@libs/database';

@Injectable()
export class SpecialityService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createSpecialityDto: CreateSpecialityDto) {
    return this.databaseService.speciality.create({
      data: {
        ...createSpecialityDto,
      },
    });
  }

  async addWorkProfession(
    id: number,
    addWorkProfessionDto: AddWorkProfessionDto,
  ) {
    await this.databaseService.workProfessionToSpeciality.deleteMany({
      where: {
        specialityId: id,
      },
    });

    return await this.databaseService.workProfessionToSpeciality.createMany({
      data: [
        ...addWorkProfessionDto.workProfessions.map((workProfession) => ({
          specialityId: id,
          workProfessionId: workProfession,
        })),
      ],
    });
  }

  findOneById(id: number) {
    return this.databaseService.speciality.findFirst({
      where: {
        id,
      },
    });
  }
  findOneByName(name: string) {
    return this.databaseService.speciality.findFirst({
      where: {
        name,
      },
    });
  }

  findAllByDirectionId(directionId: number) {
    return this.databaseService.speciality.findMany({
      where: {
        directionId,
      },
    });
  }

  update(id: number, updateSpecialityDto: UpdateSpecialityDto) {
    return this.databaseService.speciality.update({
      where: {
        id,
      },
      data: {
        ...updateSpecialityDto,
      },
    });
  }

  remove(id: number) {
    return this.databaseService.speciality.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
