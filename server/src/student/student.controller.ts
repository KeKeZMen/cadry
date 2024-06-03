import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { RolesGuard } from '@auth/guards/roles.guards';
import { Roles } from '@shared/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return await this.studentService.create(createStudentDto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importStudents(@UploadedFile() file: Express.Multer.File) {
    return await this.studentService.importStudents(file);
  }

  @Get(':userIdOrEmail')
  async findOneByUserIdOrEmail(@Param('userIdOrEmail') userIdOrEmail: string) {
    return await this.studentService.findOneByUserIdOrEmail(userIdOrEmail);
  }

  @Get('activation/:userId')
  async activateStudent(@Param('userId') userId: string) {}

  @UseGuards(RolesGuard)
  @Roles('Admin')
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return await this.studentService.remove(userId);
  }
}
