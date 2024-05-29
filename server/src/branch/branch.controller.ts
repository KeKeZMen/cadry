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
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { CurrentUser, Public } from '@shared/decorators';
import { UserService } from '@user/user.service';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly userService: UserService,
  ) {}

  @Post(':organizationId')
  async create(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
    @Body() createBranchDto: CreateBranchDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      (user.organization.id === organizationId &&
        user.role === 'Organization') ||
      user.role === 'Admin';

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return this.branchService.create(createBranchDto);
  }

  @Public()
  @Get(':organizationId')
  async findManyByOrganizationId(
    @Param('organizationId') organizationId: string,
  ) {
    return await this.branchService.findManyByOrganizationId(organizationId);
  }

  @Patch(':branchId')
  async update(
    @Param('branchId') branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      (user.employee.branchId === branchId &&
        user.employee.employeeType === 'Manager') ||
      user.role === 'Admin';

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return await this.branchService.update(branchId, updateBranchDto);
  }

  @Delete(':branchId')
  async remove(
    @Param('branchId') branchId: string,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      (user.employee.branchId === branchId &&
        user.employee.employeeType === 'Manager') ||
      user.role === 'Admin';

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return await this.branchService.remove(branchId);
  }
}
