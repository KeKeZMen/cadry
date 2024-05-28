import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { BranchService } from '@branch/branch.service';
import { CurrentUser, Roles } from '@shared/decorators';
import { UserService } from '@user/user.service';

@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly branchService: BranchService,
    private readonly userService: UserService,
  ) {}

  @Roles('Admin')
  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Get(':name')
  async findOneByName(@Param('name') name: string) {
    return await this.organizationService.findManyByName(name);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);

    if (
      user.branch.organizationId !== id ||
      (user.role !== 'Manager' && user.role !== 'Admin')
    ) {
      throw new UnauthorizedException();
    }

    return await this.organizationService.update(id, updateOrganizationDto);
  }

  @Roles('Admin')
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const branches = await this.branchService.findManyByOrganizationId(id);

    if (branches.length >= 1) {
      throw new ConflictException(
        'Невозможно удалить организацию, которая имеет филиалы',
      );
    }

    return await this.organizationService.remove(id);
  }
}
