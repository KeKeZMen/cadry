import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ImportService } from "./import.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { RolesGuard } from "@auth/guards/roles.guards";
import { CurrentUser, Roles } from "@libs/decorators";

@Roles("Employee", "Admin")
@UseGuards(RolesGuard)
@Controller("import")
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  async importStudents(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: IJwtPayload
  ) {
    return await this.importService.import(file, currentUser.id);
  }
}
