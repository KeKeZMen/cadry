import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { CurrentUser } from '@shared/decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    return await this.userService.findUsersByEmail(email);
  }

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

  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: IJwtPayload,
  ) {
    if (currentUser.role !== 'Admin' && currentUser.id !== id) {
      throw new UnauthorizedException();
    }

    return await this.userService.delete(id);
  }
}
