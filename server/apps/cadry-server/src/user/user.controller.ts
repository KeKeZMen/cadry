import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { RolesGuard } from '@auth/guards/roles.guards';
import { CurrentUser, Roles } from '@libs/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    if (currentUser.role !== 'Admin' && currentUser.id !== id) {
      throw new UnauthorizedException();
    }

    if (currentUser.role !== 'Admin' && updateUserDto.role) {
      throw new UnauthorizedException();
    }

    return await this.userService.update(id, updateUserDto);
  }

  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.delete(id);
  }
}
