import { Injectable } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class DirectionService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createDirectionDto: CreateDirectionDto) {
    return this.databaseService.direction.create({
      data: {
        ...createDirectionDto,
      },
    });
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
    return this.databaseService.direction.update({
      where: {
        id,
      },
      data: {
        ...updateDirectionDto,
      },
    });
  }

  remove(id: number) {
    return this.databaseService.direction.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
