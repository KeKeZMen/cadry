import { Controller, Get } from "@nestjs/common";
import { ImportService } from "./import.service";
import { Public } from "@libs/decorators";

@Public()
@Controller("import")
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Get()
  async test() {
    return await this.importService.test();
  }
}
