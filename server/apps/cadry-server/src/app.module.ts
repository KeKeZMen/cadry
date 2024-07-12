import { AuthModule } from "@auth/auth.module";
import { JwtGuard } from "@auth/guards/jwt.guard";
import { BranchModule } from "@branch/branch.module";
import { DirectionModule } from "@direction/direction.module";
import { EmployeeModule } from "@employee/employee.module";
import { DatabaseModule } from "@libs/database";
import { RmqModule, IMPORT_QUEUE } from "@libs/rmq";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { OrganizationModule } from "@organization/organization.module";
import { SpecialityModule } from "@speciality/speciality.module";
import { IsActiveGuard } from "@student/guards/IsActive.guard";
import { StudentModule } from "@student/student.module";
import { UserModule } from "@user/user.module";
import { WorkProfessionModule } from "@work-profession/work-profession.module";
import { ImportModule } from "./import/import.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    DatabaseModule,
    UserModule,
    AuthModule,
    OrganizationModule,
    BranchModule,
    EmployeeModule,
    StudentModule,
    DirectionModule,
    SpecialityModule,
    WorkProfessionModule,
    ImportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IsActiveGuard,
    },
  ],
})
export class AppModule {}
