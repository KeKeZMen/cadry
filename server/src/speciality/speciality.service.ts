import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { AddWorkProfessionDto } from './dto/add-work-profession.dto';

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

  addWorkProfession(id: number, addWorkProfessionDto: AddWorkProfessionDto) {
    return this.databaseService.workProfessionToSpeciality.createMany({
      data: [
        ...addWorkProfessionDto.workProfessions.map((workProfession) => ({
          specialityId: id,
          workProfessionId: workProfession,
        })),
      ],
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
