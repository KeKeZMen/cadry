import { Module } from "@nestjs/common";
import { ImportService } from "./import.service";
import { ImportController } from "./import.controller";
import { IMPORT_QUEUE, RmqModule } from "@libs/rmq";

@Module({
  controllers: [ImportController],
  providers: [ImportService],
  imports: [
    RmqModule.register({
      name: IMPORT_QUEUE,
    }),
  ],
})
export class ImportModule {}
