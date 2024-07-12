import { Controller } from "@nestjs/common";
import { ImportService } from "./import.service";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @MessagePattern("import")
  async import(@Payload() uuid: string) {
    return await this.importService.import(uuid);
  }
}
