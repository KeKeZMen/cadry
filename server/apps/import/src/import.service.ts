import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import exceljs from "exceljs";
import { DatabaseService } from "@libs/database";
import { unlink } from "fs/promises";

@Injectable()
export class ImportService {
  constructor(private readonly databaseService: DatabaseService) {}

  async import(uuid: string) {
    const students = [];
    const filePath = `files/${uuid}.xlsx`;

    const wb = new exceljs.Workbook();
    const workbook = await wb.xlsx.readFile(filePath);

    const worksheet = workbook.getWorksheet("Шаблон");
    if (!worksheet) throw new BadRequestException("Неверный формат таблицы");

    const organizationName = worksheet.getCell(3, 2).value.toString();

    const educationOrganization =
      await this.databaseService.organization.findFirst({
        where: {
          name: organizationName,
        },
      });
    const professions = await this.databaseService.workProfession.findMany();

    for (let j = 5; j <= worksheet.actualRowCount; j++) {
      const email = worksheet.getCell(j, 7).value as {
        hyperlink: string;
        text: string;
      };
      const password = Math.random().toString(36).slice(-8);

      const candidate = await this.databaseService.user.findFirst({
        where: { email: email.text },
      });

      if (candidate) {
        throw new ConflictException(
          `Пользователь с email ${email.text} уже существует`
        );
      }

      const user = await this.databaseService.user.create({
        data: {
          phoneNumber: worksheet.getCell(j, 6).value.toString().trim(),
          email: email.text,
          lastName: worksheet.getCell(j, 1).value.toString().trim(),
          firstName: worksheet.getCell(j, 2).value.toString().trim(),
          secondName: worksheet.getCell(j, 3).value.toString().trim(),
          role: "Student",
          password,
        },
      });

      students.push({
        firstName: user.firstName,
        secondName: user.secondName,
        lastName: user.lastName,
        email: user.email,
        password,
      });

      const subProfessions = [];

      for (let i = 11; i <= 15; i++) {
        if (i % 2 !== 0) {
          const subProfessionName = worksheet.getCell(j, i).value?.toString();
          if (!subProfessionName) continue;
          const subProfessionCategory = worksheet
            .getCell(j, i + 1)
            .value?.toString();

          professions.map((profession) => {
            if (profession.name === subProfessionName) {
              subProfessions.push({
                id: profession.id,
                category: subProfessionCategory,
              });
            }
          });
        }
      }

      const birthDate = worksheet.getCell(j, 4).value as Date;

      await this.databaseService.student.create({
        data: {
          userId: user.id,
          birthDate,
          gender:
            worksheet.getCell(j, 5).value.toString().trim() == "М"
              ? "Man"
              : "Women",
          address: worksheet.getCell(j, 8).value.toString().trim(),
          gpa: parseFloat(worksheet.getCell(j, 9).value.toString()),
          socialAdaptability: +worksheet.getCell(j, 10).value.toString().trim(),
          graduateYear: +worksheet.getCell(2, 2).value.toString(),
          educationOrganizationId: educationOrganization.id,
          professionId: professions.find(
            (profession) =>
              profession.name === worksheet.getCell(j, 17).value.toString()
          ).id,
          subProfessions,
        },
      });
    }

    await unlink(filePath);

    return students;
  }
}
