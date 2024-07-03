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
import { CreateWorkProfessionDto } from './dto/create-work-profession.dto';
import { UpdateWorkProfessionDto } from './dto/update-work-profession.dto';
import { WorkProfessionService } from './work-profession.service';
import { RolesGuard } from '@auth/guards/roles.guards';
import { Public, Roles } from '@shared/decorators';

@Roles('Admin')
@UseGuards(RolesGuard)
@Controller('work-profession')
export class WorkProfessionController {
  constructor(private readonly workProfessionService: WorkProfessionService) {}

  @Post()
  async create(@Body() createProfessionDto: CreateWorkProfessionDto) {
    return await this.workProfessionService.create(createProfessionDto);
  }

  @Public()
  @Get()
  async getAll() {
    return await this.workProfessionService.findMany();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfessionDto: UpdateWorkProfessionDto,
  ) {
    return this.workProfessionService.update(+id, updateProfessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workProfessionService.remove(+id);
  }
}
