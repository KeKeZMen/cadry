import { Controller } from "@nestjs/common";
import { ImportService } from "./import.service";
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from "@nestjs/microservices";
import { RmqService } from "@libs/rmq";

@Controller()
export class ImportController {
  constructor(
    private readonly importService: ImportService,
    private readonly rmqService: RmqService
  ) {}

  @MessagePattern("import")
  async import(@Payload() data: { uuid: string }, @Ctx() context: RmqContext) {
    const uuid = await this.importService.test(data.uuid);
    console.log(uuid);
    this.rmqService.ack(context);
  }
}
