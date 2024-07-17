import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { StudentService } from "./student.service";
import { CreateStudentDto } from "./dto/create-student.dto";
import { RolesGuard } from "@auth/guards/roles.guards";
import { UserService } from "@user/user.service";
import { CurrentUser, Public, Roles } from "@libs/decorators";

@Roles("Employee", "Admin", "Organization")
@UseGuards(RolesGuard)
@Controller("student")
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService
  ) {}

  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === createStudentDto.educationOrganizationId) ||
      (user.role === "Employee" &&
        user.employee.employeeType === "Graduates" &&
        user.employee.branch.organizationId ===
          createStudentDto.educationOrganizationId);

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return await this.studentService.create(createStudentDto);
  }

  @Get(":email")
  async findOneByUserIdOrEmail(@Param("email") email: string) {
    return await this.studentService.findOneByUserIdOrEmail(email);
  }

  @Public()
  @Get("activation/:userId")
  async activateStudent(@Param("userId") userId: string) {
    return await this.studentService.activateStudent(userId);
  }

  @Delete(":userId")
  async remove(
    @Param("userId") userId: string,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const student = await this.studentService.findOneByUserIdOrEmail(userId);

    const canDelete =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === student.educationOrganizationId) ||
      (user.role === "Employee" &&
        user.employee.employeeType === "Graduates" &&
        user.employee.branch.organizationId ===
          student.educationOrganizationId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    return await this.studentService.remove(userId);
  }
}
