import { Module } from "@nestjs/common";
import { ImportService } from "./import.service";
import { ImportController } from "./import.controller";
import { IMPORT_QUEUE, RmqModule } from "@libs/rmq";
import { UserModule } from "@user/user.module";
import { OrganizationModule } from "@organization/organization.module";

@Module({
  controllers: [ImportController],
  providers: [ImportService],
  imports: [
    RmqModule.register({
      name: IMPORT_QUEUE,
    }),
    UserModule,
    OrganizationModule,
  ],
})
export class ImportModule {}
