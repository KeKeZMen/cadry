import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CurrentUser, Public, Roles } from '@shared/decorators';
import { UserService } from '@user/user.service';
import { RolesGuard } from '@auth/guards/roles.guards';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly userService: UserService,
  ) {}

  @Roles('Employee', 'Organization', 'Admin')
  @UseGuards(RolesGuard)
  @Post(':organizationId')
  async create(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() createBranchDto: CreateBranchDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      (user.organization.id === organizationId &&
        user.employee.employeeType === 'Manager') ||
      (user.role === 'Organization' &&
        organizationId === user.organization.id) ||
      user.role === 'Admin';

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return this.branchService.create(createBranchDto, organizationId);
  }

  @Public()
  @Get(':organizationId')
  async findManyByOrganizationId(
    @Param('organizationId') organizationId: string,
  ) {
    return await this.branchService.findManyByOrganizationId(organizationId);
  }

  @Roles('Employee', 'Organization', 'Admin')
  @UseGuards(RolesGuard)
  @Patch(':branchId')
  async update(
    @Param('branchId') branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization =
      await this.branchService.getOrganizationIdByBranch(branchId);

    const canUpdate =
      (user.employee.branchId === branchId &&
        user.employee.employeeType === 'Manager') ||
      (user.role === 'Organization' &&
        organization.id === user.organization.id) ||
      user.role === 'Admin';

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    return await this.branchService.update(branchId, updateBranchDto);
  }

  @Roles('Employee', 'Organization', 'Admin')
  @UseGuards(RolesGuard)
  @Delete(':branchId')
  async remove(
    @Param('branchId') branchId: string,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization =
      await this.branchService.getOrganizationIdByBranch(branchId);

    const canDelete =
      (user.employee.branchId === branchId &&
        user.employee.employeeType === 'Manager') ||
      (user.role === 'Organization' &&
        user.organization.id === organization.id) ||
      user.role === 'Admin';

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    return await this.branchService.remove(branchId);
  }
}
