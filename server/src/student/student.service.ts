import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { DatabaseService } from '@database/database.service';
import { UserService } from '@user/user.service';
import { OrganizationService } from '@organization/organization.service';
import * as ExcelJs from 'exceljs';
import * as tmp from 'tmp';
import * as fs from 'fs/promises';

@Injectable()
export class StudentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
  ) {}

  create(createStudentDto: Partial<CreateStudentDto>) {
    return this.databaseService.student.create({
      data: {
        address: createStudentDto.address,
        birthDate: createStudentDto.birthDate,
        gender: createStudentDto.gender,
        graduateYear: createStudentDto.graduateYear,
        educationOrganizationId: createStudentDto.educationOrganizationId,
        professionId: createStudentDto.professionId,
        userId: createStudentDto.userId,
      },
    });
  }

  async importStudents(file: Express.Multer.File) {
    tmp.file(async (err, name) => {
      if (err) throw new BadRequestException('Ошибка чтения файла');

      await fs.writeFile(name, file.buffer);

      const wb = new ExcelJs.Workbook();
      const workbook = await wb.xlsx.readFile(name);

      const worksheet = workbook.getWorksheet('Данные');
      if (!worksheet) throw new BadRequestException('Неверный формат таблицы');

      const professions = await this.databaseService.profession.findMany();
      const educationOrganization =
        await this.organizationService.findOneByName(
          worksheet.getCell(3, 2).value.toString().trim(),
        );

      const students = [];

      for (let j = 5; j <= worksheet.actualRowCount; j++) {
        const password = Math.random().toString(36).slice(-8);
        const user = await this.userService.create({
          phoneNumber: worksheet.getCell(j, 6).value.toString().trim(),
          email: worksheet.getCell(j, 7).value.toString().trim(),
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

        const date = worksheet
          .getCell(j, 4)
          .value.toString()
          .trim()
          .split('.')
          .map((d) => +d);    

        await this.create({
          userId: user.id,
          birthDate: new Date(date[2], date[1], date[0]),
          gender:
            worksheet.getCell(j, 5).value.toString().trim() == 'М'
              ? 'Man'
              : 'Women',
          address: worksheet.getCell(j, 8).value.toString().trim(),
          gpa: parseFloat(worksheet.getCell(j, 9).value.toString()),
          socialAdaptability: +worksheet.getCell(j, 10).value.toString().trim(),
          professionId: professions.find(
            (profession) =>
              profession.name ==
              worksheet.getCell(j, 11).value.toString().trim(),
          ).id,
          graduateYear: +worksheet.getCell(2, 2).value.toString(),
          educationOrganizationId: educationOrganization.id,
        });
      }

      return students;
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
}
