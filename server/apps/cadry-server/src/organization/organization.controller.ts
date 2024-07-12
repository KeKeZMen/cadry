import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ConflictException,
  UnauthorizedException,
  UseGuards,
  Get,
  Res,
  Header,
} from "@nestjs/common";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDto, UpdateOrganizationDto } from "./dto";
import { BranchService } from "@branch/branch.service";
import { UserService } from "@user/user.service";
import { RolesGuard } from "@auth/guards/roles.guards";
import { Response } from "express";
import { CurrentUser, Public, Roles } from "@libs/decorators";

@Controller("organization")
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly branchService: BranchService,
    private readonly userService: UserService
  ) {}

  @Roles("Admin")
  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Public()
  async getAll() {
    return await this.organizationService.findMany();
  }

  @Roles("Organization", "Admin")
  @UseGuards(RolesGuard)
  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) organizationId: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canUpdate =
      (user.role === "Organization" &&
        user.organization.id === organizationId) ||
      (user.employee.employeeType === "Manager" &&
        user.organization.id === organizationId) ||
      user.role === "Admin";

    if (canUpdate) {
      throw new UnauthorizedException();
    }

    return await this.organizationService.update(
      organizationId,
      updateOrganizationDto
    );
  }

  @Roles("Admin")
  @UseGuards(RolesGuard)
  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    const branches = await this.branchService.findManyByOrganizationId(id);

    if (branches.length >= 1) {
      throw new ConflictException(
        "Невозможно удалить организацию, которая имеет филиалы"
      );
    }

    return await this.organizationService.remove(id);
  }

  @Roles("Employee", "Organization", "Admin")
  @UseGuards(RolesGuard)
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  @Get("template/:organizationId/:specialityId")
  async getDocumentTemplate(
    @Param("organizationId") organizationId: string,
    @Param("specialityId") specialityId: string,
    @CurrentUser() currentUser: IJwtPayload,
    @Res() res: Response
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canGet =
      (user.employee.employeeType === "Graduates" &&
        user.organization.id === organizationId) ||
      (user.role === "Organization" &&
        user.organization.id === organizationId) ||
      user.role === "Admin";

    if (!canGet) {
      throw new UnauthorizedException();
    }

    const fileStream = await this.organizationService.getTemplateStream(
      +specialityId,
      organizationId
    );

    fileStream.pipe(res);
  }
}
