import { Injectable } from "@nestjs/common";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UserService } from "@user/user.service";
import { DatabaseService } from "@libs/database";

@Injectable()
export class StudentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService
  ) {}

  create(createStudentDto: Partial<CreateStudentDto>) {
    return this.databaseService.student.create({
      data: {
        address: createStudentDto.address,
        birthDate: createStudentDto.birthDate,
        gender: createStudentDto.gender,
        graduateYear: createStudentDto.graduateYear,
        educationOrganizationId: createStudentDto.educationOrganizationId,
        userId: createStudentDto.userId,
        gpa: createStudentDto.gpa,
        socialAdaptability: createStudentDto.socialAdaptability,
        subProfessions: createStudentDto.subProfessions,
        professionId: createStudentDto.professionId,
      },
    });
  }

  findOneByUserIdOrEmail(userIdOrEmail: string) {
    return this.databaseService.student.findFirst({
      where: {
        user: {
          OR: [{ email: userIdOrEmail }, { id: userIdOrEmail }],
        },
      },
    });
  }

  async remove(userId: string) {
    await this.databaseService.student.delete({
      where: {
        userId,
      },
    });

    return await this.userService.delete(userId);
  }

  activateStudent(userId: string) {
    return this.databaseService.student.update({
      where: {
        userId,
      },
      data: {
        isActive: true,
      },
    });
  }
}
