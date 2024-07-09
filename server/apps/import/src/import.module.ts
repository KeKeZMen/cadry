import { Module } from "@nestjs/common";
import { ImportController } from "./import.controller";
import { ImportService } from "./import.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@libs/database";
import { RmqModule } from "@libs/rmq";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    RmqModule,
  ],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
