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
      dataWorksheet.addRow([profession.workProfession.name]);
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
      'Доп. профессия 2',
      'Доп. профессия 3',
      'Основная профессия',
    ]);

    for (let j = 5; j <= 40; j++) {
      for (let i = 11; i <= 14; i++) {
        templateWorksheet.getCell(j, i).dataValidation = {
          type: 'list',
          promptTitle: 'Выберите значение',
          prompt: 'Выберите значение из списка',
          allowBlank: true,
          formulae: [`=Данные!$A:$A`],
          showErrorMessage: true,
        };
      }

      templateWorksheet.getCell(j, 5).dataValidation = {
        type: 'list',
        promptTitle: 'Выберите значение',
        prompt: 'Выберите значение из списка',
        allowBlank: false,
        formulae: ['"М, Ж"'],
        showErrorMessage: true,
      };
    }

    await workbook.xlsx.writeFile(tmpPath);

    return createReadStream(tmpPath);
  }

  update(userId: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.databaseService.organization.update({
      where: {
        userId,
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
