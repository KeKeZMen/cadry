import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { DatabaseService } from '@database/database.service';
import { UserService } from '@user/user.service';
import { OrganizationService } from '@organization/organization.service';
import { WorkProfessionService } from '@work-profession/work-profession.service';
import * as ExcelJs from 'exceljs';
import * as tmp from 'tmp';
import * as fs from 'fs/promises';

@Injectable()
export class StudentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly workProfessionService: WorkProfessionService,
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

  async importStudents(file: Express.Multer.File) {
    const students = [];

    const tmpPath = tmp.tmpNameSync();
    await fs.writeFile(tmpPath, file.buffer);

    const wb = new ExcelJs.Workbook();
    const workbook = await wb.xlsx.readFile(tmpPath);

    const worksheet = workbook.getWorksheet('Шаблон');
    if (!worksheet) throw new BadRequestException('Неверный формат таблицы');

    const organizationName = worksheet.getCell(3, 2).value.toString();

    const educationOrganization =
      await this.organizationService.findOneByName(organizationName);
    const professions = await this.workProfessionService.findMany();
    

    for (let j = 5; j <= worksheet.actualRowCount; j++) {
      const email = worksheet.getCell(j, 7).value as {
        hyperlink: string;
        text: string;
      };
      const password = Math.random().toString(36).slice(-8);

      const candidate = await this.userService.findOneByIdOrEmail(email.text);

      if (candidate) {
        throw new ConflictException(
          `Пользователь с email ${email.text} уже существует`,
        );
      }

      const user = await this.userService.create({
        phoneNumber: worksheet.getCell(j, 6).value.toString().trim(),
        email: email.text,
        lastName: worksheet.getCell(j, 1).value.toString().trim(),
        firstName: worksheet.getCell(j, 2).value.toString().trim(),
        secondName: worksheet.getCell(j, 3).value.toString().trim(),
        role: 'Student',
        password,
      });

      students.push({
        firstName: user.firstName,
        secondName: user.secondName,
        lastName: user.lastName,
        email: user.email,
        password,
      });

      const subProfessions = []

      for (let i = 11; i <= 15; i++) {
        if(i % 2 !== 0) {
          const subProfessionName = worksheet.getCell(j, i).value?.toString();
          if(!subProfessionName) continue
          const subProfessionCategory = worksheet.getCell(j, i + 1).value?.toString()

          professions.map(profession => {
            if(profession.name === subProfessionName) {
              subProfessions.push({
                id: profession.id,
                category: subProfessionCategory,
              });
            }
          })
        }
      }

      const birthDate = worksheet.getCell(j, 4).value as Date

      await this.create({
        userId: user.id,
        birthDate,
        gender:
          worksheet.getCell(j, 5).value.toString().trim() == 'М'
            ? 'Man'
            : 'Women',
        address: worksheet.getCell(j, 8).value.toString().trim(),
        gpa: parseFloat(worksheet.getCell(j, 9).value.toString()),
        socialAdaptability: +worksheet.getCell(j, 10).value.toString().trim(),
        graduateYear: +worksheet.getCell(2, 2).value.toString(),
        educationOrganizationId: educationOrganization.id,
        professionId: professions.find(
          (profession) =>
            profession.name === worksheet.getCell(j, 17).value.toString(),
        ).id,
        subProfessions
      });
    }

    return students;
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
