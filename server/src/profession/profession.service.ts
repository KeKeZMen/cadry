import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';

@Injectable()
export class ProfessionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createProfessionDto: CreateProfessionDto) {
    return 'This action adds a new profession';
  }

  findOneById(id: number) {
    return this.databaseService.profession.findFirst({
      where: {
        id,
      },
    });
  }

  findAllBySpecialityIdOrDirectionId(specialityIdOrDirectionId: number) {
    return this.databaseService.profession.findMany({
      where: {
        OR: [
          {
            specialityId: specialityIdOrDirectionId,
          },
          {
            speciality: {
              directionId: specialityIdOrDirectionId,
            },
          },
        ],
      },
    });
  }

  update(id: number, updateProfessionDto: UpdateProfessionDto) {
    return `This action updates a #${id} profession`;
  }

  remove(id: number) {
    return `This action removes a #${id} profession`;
  }
}
