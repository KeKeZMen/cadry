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
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { RolesGuard } from '@auth/guards/roles.guards';
import { Public, Roles } from '@shared/decorators';
import { AddWorkProfessionDto } from './dto/add-work-profession.dto';

@Roles('Admin')
@UseGuards(RolesGuard)
@Controller('speciality')
export class SpecialityController {
  constructor(private readonly specialityService: SpecialityService) {}

  @Post()
  create(@Body() createSpecialityDto: CreateSpecialityDto) {
    return this.specialityService.create(createSpecialityDto);
  }

  @Post(':id')
  addWorkProfession(
    @Param('id') id: string,
    @Body() addWorkProfessionDto: AddWorkProfessionDto,
  ) {
    return this.specialityService.addWorkProfession(+id, addWorkProfessionDto);
  }

  @Public()
  @Get('direction/:directionId')
  findAll(@Param('directionId') directionId: number) {
    return this.specialityService.findAllByDirectionId(directionId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpecialityDto: UpdateSpecialityDto,
  ) {
    return this.specialityService.update(+id, updateSpecialityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialityService.remove(+id);
  }
}
