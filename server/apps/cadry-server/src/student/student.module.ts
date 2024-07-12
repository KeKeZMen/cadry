import { Module } from "@nestjs/common";
import { StudentService } from "./student.service";
import { StudentController } from "./student.controller";
import { UserModule } from "@user/user.module";
import { IsActiveGuard } from "./guards/IsActive.guard";

@Module({
  controllers: [StudentController],
  providers: [StudentService, IsActiveGuard],
  imports: [UserModule],
  exports: [StudentService],
})
export class StudentModule {}
