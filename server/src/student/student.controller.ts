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
import { Public, Roles } from '@shared/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Roles("Employee", "Admin")
@UseGuards(RolesGuard)
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

  @Get(':email')
  async findOneByUserIdOrEmail(@Param('email') email: string) {
    return await this.studentService.findOneByUserIdOrEmail(email);
  }

  @Public()
  @Get('activation/:userId')
  async activateStudent(@Param('userId') userId: string) {
    return await this.studentService.activateStudent(userId);
  }

  @Roles("Employee")
  @UseGuards(RolesGuard)
  @Delete(':userId')
  async remove(@Param('userId') userId: string) {
    return await this.studentService.remove(userId);
  }
}
