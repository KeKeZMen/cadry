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
} from "@nestjs/common";
import { BranchService } from "./branch.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { UpdateBranchDto } from "./dto/update-branch.dto";
import { CurrentUser, Public, Roles } from "@libs/decorators";
import { UserService } from "@user/user.service";
import { RolesGuard } from "@auth/guards/roles.guards";

@Roles("Employee", "Organization", "Admin")
@UseGuards(RolesGuard)
@Controller("branch")
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly userService: UserService
  ) {}

  @Post(":organizationId")
  async create(
    @Param("organizationId", ParseUUIDPipe) organizationId: string,
    @Body() createBranchDto: CreateBranchDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      user.role === "Admin" ||
      (user.role === "Organization" && user.organization.id === organizationId);

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return await this.branchService.create(createBranchDto, organizationId);
  }

  @Public()
  @Get(":organizationId")
  async findManyByOrganizationId(
    @Param("organizationId") organizationId: string
  ) {
    return await this.branchService.findManyByOrganizationId(organizationId);
  }

  @Patch(":branchId")
  async update(
    @Param("branchId") branchId: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization =
      await this.branchService.getOrganizationIdByBranch(branchId);

    const canUpdate =
      user.role === "Admin" ||
      (user.employee.employeeType === "Manager" &&
        user.employee.branch.id === branchId) ||
      (user.role === "Organization" &&
        user.organization.id === organization.id);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    return await this.branchService.update(branchId, updateBranchDto);
  }

  @Delete(":branchId")
  async remove(
    @Param("branchId") branchId: string,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization =
      await this.branchService.getOrganizationIdByBranch(branchId);

    const canDelete =
      user.role === "Admin" ||
      (user.employee.employeeType === "Manager" &&
        user.employee.branch.id === branchId) ||
      (user.role === "Organization" &&
        user.organization.id === organization.id);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    return await this.branchService.remove(branchId);
  }
}
