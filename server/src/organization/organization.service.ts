import { Injectable } from '@nestjs/common';
import { tmpNameSync } from 'tmp';
import { createReadStream } from 'fs';
import { Workbook } from 'exceljs';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateOrganizationUserDto,
} from './dto';
import { WorkProfessionService } from '@work-profession/work-profession.service';
import { DatabaseService } from '@database/database.service';
import { SpecialityService } from '@speciality/speciality.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly specialityService: SpecialityService,
    private readonly workProfessionService: WorkProfessionService,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.databaseService.organization.create({
      data: {
        ...createOrganizationDto,
      },
    });
  }

  createOrganizationViaUser(
    createOrganizationUserDto: CreateOrganizationUserDto,
  ) {
    return this.databaseService.organization.create({
      data: {
        ...createOrganizationUserDto,
        type: 'Organization',
      },
    });
  }

  findMany() {
    return this.databaseService.organization.findMany();
  }

  findOneByIdOrInn(idOrInn: string) {
    return this.databaseService.organization.findFirst({
      where: {
        OR: [{ id: idOrInn }, { inn: idOrInn }],
      },
    });
  }

  findOneByUserId(userId: string) {
    return this.databaseService.organization.findFirst({
      where: {
        userId,
      },
    });
  }

  findOneByName(name: string) {
    return this.databaseService.organization.findFirst({
      where: {
        name,
      },
    });
  }

  async getTemplateStream(specialityId: number, organizationId: string) {
    const organization = await this.findOneByIdOrInn(organizationId);
    const speciality = await this.specialityService.findOneById(specialityId);
    const professions =
      await this.workProfessionService.findManyBySpecialityId(specialityId);

    const tmpPath = tmpNameSync();
    const workbook = new Workbook();

    const dataWorksheet = workbook.addWorksheet('Данные');
    professions.forEach((profession) => {
      dataWorksheet.addRow([
        profession.workProfession.name,
        profession.workProfession.category,
      ]);
    });

    const templateWorksheet = workbook.addWorksheet('Шаблон');
    templateWorksheet.addRow(['Направление/Специальность', speciality.name]);
    templateWorksheet.addRow(['Год выпуска', new Date().getFullYear()]);
    templateWorksheet.addRow(['Образовательное учреждение', organization.name]);
    templateWorksheet.addRow([
      'Фамилия',
      'Имя',
      'Отчество',
      'Дата рождения',
      'Пол',
      'Телефон',
      'Email',
      'Населенный пункт регистрации',
      'Средний балл по аттестату(5-бальная шкала)',
      'Социальная адаптированность(100-бальная шкала)',
      'Доп. профессия 1',
      'Категория',
      'Доп. профессия 2',
      'Категория',
      'Доп. профессия 3',
      'Категория',
      'Основная профессия',
    ]);

    for (let j = 5; j <= 40; j++) {
      templateWorksheet.getCell(j, 9).dataValidation = {
        type: 'decimal',
        formulae: [1, 5],
        showErrorMessage: true,
        errorTitle: 'Неверно введен средний балл по аттестату',
        error: 'Введите значение от 1 до 5',
      };

      templateWorksheet.getCell(j, 10).dataValidation = {
        type: 'whole',
        formulae: [1, 100],
        showErrorMessage: true,
        errorTitle: 'Неверно введен балл социальной адаптированности',
        error: 'Введите значение от 1 до 100',
      };

      templateWorksheet.getCell(j, 5).dataValidation = {
        type: 'list',
        promptTitle: 'Выберите значение',
        prompt: 'Выберите значение из списка',
        allowBlank: false,
        formulae: ['"М, Ж"'],
        showErrorMessage: true,
      };

      for (let i = 11; i <= 17; i++) {
        if (i % 2 !== 0) {
          templateWorksheet.getCell(j, i).dataValidation = {
            type: 'list',
            promptTitle: 'Выберите значение',
            prompt: 'Выберите значение из списка',
            allowBlank: true,
            formulae: [`=Данные!$A:$A`],
            showErrorMessage: true,
          };
        }

        // min: =VALUE(MID(VLOOKUP(A13;Данные!A:B;2);1;SEARCH("-";VLOOKUP(A13;Данные!A:B;2))-1))
        // max: =VALUE(MID(VLOOKUP(A13;Данные!A:B;2);SEARCH("-";VLOOKUP(A13;Данные!A:B;2))+1;LEN(VLOOKUP(A13;Данные!A:B;2))-SEARCH("-";VLOOKUP(A13;Данные!A:B;2))))

        if (i % 2 == 0) {
          const prevCell = templateWorksheet.getCell(j, i - 1).address;
          const minFormula =
            '=VALUE(MID(VLOOKUP(' +
            prevCell +
            ',Данные!A:B,2),1,SEARCH("-",VLOOKUP(' +
            prevCell +
            ',Данные!A:B,2))-1))';

          const maxFormula =
            '=VALUE(MID(VLOOKUP(' +
            prevCell +
            ',Данные!A:B,2),SEARCH("-",VLOOKUP(' +
            prevCell +
            ',Данные!A:B,2))+1,LEN(VLOOKUP(' +
            prevCell +
            ',Данные!A:B,2))-SEARCH("-",VLOOKUP(' +
            prevCell +
            ',Данные!A:B,2))))';

          templateWorksheet.getCell(j, i).dataValidation = {
            type: 'whole',
            operator: 'between',
            errorTitle: 'Неверно выбрана категория',
            error:
              'Выберите категорию из указанного для специальности диапазона',
            showErrorMessage: true,
            formulae: [minFormula, maxFormula],
          };
        }
      }
    }

    await workbook.xlsx.writeFile(tmpPath);

    return createReadStream(tmpPath);
  }

  update(organizationId: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.databaseService.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        ...updateOrganizationDto,
      },
      select: {
        userId: true,
      },
    });
  }

  remove(userId: string) {
    return this.databaseService.organization.delete({
      where: {
        userId,
      },
      select: {
        userId: true,
      },
    });
  }
}
