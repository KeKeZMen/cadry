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
  UnauthorizedException,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { RolesGuard } from '@auth/guards/roles.guards';
import { CurrentUser, Public, Roles } from '@shared/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '@user/user.service';

@Roles('Employee', 'Admin')
@UseGuards(RolesGuard)
@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      (user.employee.employeeType === 'Graduates' &&
        createStudentDto.educationOrganizationId === user.organization.id) ||
      user.role === 'Admin';

    if (!canCreate) {
      throw new UnauthorizedException();
    }

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

  @UseGuards(RolesGuard)
  @Delete(':userId')
  async remove(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canDelete =
      user.employee.employeeType === 'Graduates' || user.role === 'Admin';

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    return await this.studentService.remove(userId);
  }
}
