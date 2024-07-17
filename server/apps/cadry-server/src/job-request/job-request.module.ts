import { Module } from "@nestjs/common";
import { JobRequestService } from "./job-request.service";
import { JobRequestController } from "./job-request.controller";
import { UserModule } from "@user/user.module";

@Module({
  controllers: [JobRequestController],
  providers: [JobRequestService],
  imports: [UserModule],
})
export class JobRequestModule {}
