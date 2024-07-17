import {
  Controller,
  Post,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ImportService } from "./import.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "@auth/guards/roles.guards";
import { CurrentUser, Roles } from "@libs/decorators";
import { UserService } from "@user/user.service";
import { OrganizationService } from "@organization/organization.service";

@Roles("Employee", "Admin")
@UseGuards(RolesGuard)
@Controller("import")
export class ImportController {
  constructor(
    private readonly importService: ImportService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async importStudents(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    const user = await this.userService.findOneByIdOrEmail(currentUser.id);
    const organization = await this.organizationService.findOneByUserId(
      currentUser.id
    );

    const canImport =
      user.role === "Admin" ||
      (user.role === "Organization" &&
        user.organization.id === organization.id) ||
      (user.role === "Employee" &&
        (user.employee.employeeType === "Manager" ||
          user.employee.employeeType === "Graduates") &&
        user.employee.branch.organizationId === organization.id);

    if (!canImport) {
      throw new UnauthorizedException();
    }

    return await this.importService.import(file, currentUser.id);
  }
}
