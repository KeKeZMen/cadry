import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.repeatPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    return await this.userService.create(createUserDto);
  }

  @Get(':idOrEmail')
  async finOneByIdOrEmail(@Param('idOrEmail') idOrEmail: string) {
    return await this.userService.findOneByIdOrEmail(idOrEmail);
  }

  @Get()
  async findAll() {
    return await this.userService.findMany();
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (updateUserDto.password !== updateUserDto.repeatPassword) {
      throw new BadRequestException('Пароли не совпадают');
    }

    return await this.userService.update(id, updateUserDto);
  }

  @Delete('id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.delete(id);
  }
}
