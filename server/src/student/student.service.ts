import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { DatabaseService } from '@database/database.service';
import { UserService } from '@user/user.service';
import { OrganizationService } from '@organization/organization.service';
import { SpecialityService } from '@speciality/speciality.service';
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
    private readonly specialityService: SpecialityService,
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
        specialityId: createStudentDto.specialityId,
        subProfessions: createStudentDto.subProfession,
      },
    });
  }

  async importStudents(file: Express.Multer.File) {
    const students = [];

    const tmpPath = tmp.tmpNameSync();
    await fs.writeFile(tmpPath, file.buffer);

    const wb = new ExcelJs.Workbook();
    const workbook = await wb.xlsx.readFile(tmpPath);

    const worksheet = workbook.getWorksheet('Данные');
    if (!worksheet) throw new BadRequestException('Неверный формат таблицы');

    const educationOrganization = await this.organizationService.findOneByName(
      worksheet.getCell(3, 2).value.toString().trim(),
    );

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
        id: user.id,
      });

      const subProfession = [
        worksheet.getCell(j, 11).value.toString(),
        worksheet.getCell(j, 12).value.toString(),
        worksheet.getCell(j, 13).value.toString(),
      ].filter(el => el);

      const date = worksheet
        .getCell(j, 4)
        .value.toString()
        .trim()
        .split('.')
        .map((d) => +d);

      const speciality = await this.specialityService.findOneByName(
        worksheet.getCell(j, 14).value.toString(),
      );
      const professions = await this.workProfessionService.findMany();

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
        specialityId: speciality.id,
        graduateYear: +worksheet.getCell(2, 2).value.toString(),
        educationOrganizationId: educationOrganization.userId,
        subProfession: professions.map((profession) => {
          if (subProfession.includes(profession.name)) return profession.id;
        }),
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
