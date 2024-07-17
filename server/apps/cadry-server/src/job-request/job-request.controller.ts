import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { JobRequestService } from "./job-request.service";
import { CreateJobRequestDto } from "./dto/create-job-request.dto";
import { UpdateJobRequestDto } from "./dto/update-job-request.dto";
import { CurrentUser, Public, Roles } from "@libs/decorators";
import { RolesGuard } from "@auth/guards/roles.guards";
import { UserService } from "@user/user.service";

@Roles("Admin", "Organization")
@UseGuards(RolesGuard)
@Controller("job-request")
export class JobRequestController {
  constructor(
    private readonly jobRequestService: JobRequestService,
    private readonly userService: UserService
  ) {}

  @Post()
  async create(
    @Body() createJobRequestDto: CreateJobRequestDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canCreate =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === createJobRequestDto.workOrganizationId);

    if (!canCreate) {
      throw new UnauthorizedException();
    }

    return await this.jobRequestService.create(createJobRequestDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.jobRequestService.findAll();
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateJobRequestDto: UpdateJobRequestDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    const canUpdate =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === updateJobRequestDto.workOrganizationId);

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    return await this.jobRequestService.update(id, updateJobRequestDto);
  }

  @Delete(":id")
  async remove(
    @Param("id") id: string,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const jobRequest = await this.jobRequestService.findOne(id);

    const canDelete =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === jobRequest.workOrganizationId);

    if (!canDelete) {
      throw new UnauthorizedException();
    }

    return await this.jobRequestService.remove(id);
  }
}
