import { NestFactory } from "@nestjs/core";
import { ImportModule } from "./import.module";
import { RmqService, IMPORT_QUEUE } from "@libs/rmq";

async function bootstrap() {
  const app = await NestFactory.create(ImportModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(IMPORT_QUEUE, true)
  );
  await app.startAllMicroservices();
}
bootstrap();
