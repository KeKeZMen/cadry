import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DirectionService } from './direction.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { RolesGuard } from '@auth/guards/roles.guards';
import { Roles } from '@shared/decorators';

@Roles('Admin')
@UseGuards(RolesGuard)
@Controller('direction')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  @Post()
  async create(@Body() createDirectionDto: CreateDirectionDto) {
    return await this.directionService.create(createDirectionDto);
  }

  @Get()
  async findAll() {
    return await this.directionService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDirectionDto: UpdateDirectionDto,
  ) {
    return await this.directionService.update(+id, updateDirectionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.directionService.remove(+id);
  }
}
