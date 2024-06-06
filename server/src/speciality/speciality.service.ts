import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';

@Injectable()
export class SpecialityService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createSpecialityDto: CreateSpecialityDto) {
    return 'This action adds a new speciality';
  }

  findAllByDirectionId(directionId: number) {
    return this.databaseService.speciality.findMany({
      where: {
        directionId,
      },
    });
  }

  update(id: number, updateSpecialityDto: UpdateSpecialityDto) {
    return `This action updates a #${id} speciality`;
  }

  remove(id: number) {
    return `This action removes a #${id} speciality`;
  }
}
