import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Get,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { CurrentUser, Roles } from "@libs/decorators";
import { RolesGuard } from "@auth/guards/roles.guards";
import { UserService } from "@user/user.service";
import { BranchService } from "@branch/branch.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";

@Roles("Organization", "Admin")
@UseGuards(RolesGuard)
@Controller("employee")
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly userService: UserService,
    private readonly branchService: BranchService
  ) {}

  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization = await this.branchService.getOrganizationIdByBranch(
      createEmployeeDto.branchId
    );

    const canCreate =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === organization.id) ||
      (user.employee.employeeType === "Manager" &&
        user.employee.branch.id === createEmployeeDto.branchId);

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.create(createEmployeeDto);
  }

  @Get("branch/:branchId")
  async findManyByBranch(
    @Param("branchId") branchId: string,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization =
      await this.branchService.getOrganizationIdByBranch(branchId);

    const canGet =
      user.role === "Admin" || user.organization.id === organization.id;

    if (!canGet) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.findManyByBranchId(branchId);
  }

  @Get("user/:userId")
  async getEmployee(
    @Param("userId") userId: string,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const requestedUser = await this.userService.findOneByIdOrEmail(userId);

    const canGet =
      currentUser.role === "Admin" ||
      currentUser.id === userId ||
      (user.organization.id === requestedUser.organization.id &&
        user.role === "Organization");

    if (!canGet) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.findOneByUserId(userId);
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization = await this.branchService.getOrganizationIdByBranch(
      updateEmployeeDto.branchId
    );

    const canEdit =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === organization.id) ||
      (user.role === "Employee" &&
        user.employee.employeeType === "Manager" &&
        user.employee.branch.organizationId === organization.id);

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.update(id, updateEmployeeDto);
  }
}
