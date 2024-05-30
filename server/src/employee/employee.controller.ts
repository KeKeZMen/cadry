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
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CurrentUser, Roles } from '@shared/decorators';
import { RolesGuard } from '@auth/guards/roles.guards';
import { UserService } from '@user/user.service';
import { BranchService } from '@branch/branch.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Roles('Admin', 'Organization')
@UseGuards(RolesGuard)
@Controller('employee')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly userService: UserService,
    private readonly branchService: BranchService,
  ) {}

  @Post()
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization = await this.branchService.getOrganizationIdByBranch(
      createEmployeeDto.branchId,
    );

    const canCreate =
      (user.organization.id === organization.id &&
        user.role === 'Organization') ||
      user.role === 'Admin';

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.create(createEmployeeDto);
  }

  @Get(':branchId')
  async findManyByBranch(
    @Param('branchId') branchId: string,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization =
      await this.branchService.getOrganizationIdByBranch(branchId);

    const canGet =
      user.organization.id === organization.id || user.role === 'Admin';

    if (!canGet) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.findManyByBranchId(branchId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization = await this.branchService.getOrganizationIdByBranch(
      updateEmployeeDto.branchId,
    );

    const canEdit =
      user.organization.id === organization.id || user.role === 'Admin';

    if (!canEdit) {
      throw new UnauthorizedException();
    }

    return await this.employeeService.update(id, updateEmployeeDto);
  }
}
