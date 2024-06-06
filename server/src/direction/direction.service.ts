import { Injectable } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class DirectionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createDirectionDto: CreateDirectionDto) {
    return 'This action adds a new direction';
  }

  findOneById(id: number) {
    return this.databaseService.direction.findFirst({
      where: {
        id,
      },
    });
  }

  findAll() {
    return this.databaseService.direction.findMany();
  }

  update(id: number, updateDirectionDto: UpdateDirectionDto) {
    return `This action updates a #${id} direction`;
  }

  remove(id: number) {
    return `This action removes a #${id} direction`;
  }
}
