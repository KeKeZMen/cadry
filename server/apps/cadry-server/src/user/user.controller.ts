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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto";
import { RolesGuard } from "@auth/guards/roles.guards";
import { CurrentUser, Roles } from "@libs/decorators";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(":userId")
  async update(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const canUpdate = currentUser.id === userId || user.role === "Admin";

    if (!canUpdate) {
      throw new UnauthorizedException();
    }

    return await this.userService.update(userId, updateUserDto);
  }

  @Roles("Admin")
  @UseGuards(RolesGuard)
  @Delete(":userId")
  async delete(@Param("userId", ParseUUIDPipe) userId: string) {
    return await this.userService.delete(userId);
  }
}
