import { Injectable } from '@nestjs/common';
import { tmpNameSync } from 'tmp';
import { createReadStream } from 'fs';
import { Workbook } from 'exceljs';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateOrganizationUserDto,
} from './dto';
import { DirectionService } from '@direction/direction.service';
import { WorkProfessionService } from '@work-profession/work-profession.service';
import { DatabaseService } from '@database/database.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly directionService: DirectionService,
    private readonly professionService: WorkProfessionService,
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

  findOneByUserIdOrInn(userIdOrInn: string) {
    return this.databaseService.organization.findFirst({
      where: {
        OR: [{ userId: userIdOrInn }, { inn: userIdOrInn }],
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

  async getTemplateStream(professionId: number, userId: string) {
    const organization = await this.findOneByUserIdOrInn(userId);
    const profession = await this.professionService.findOneById(professionId);

    const tmpPath = tmpNameSync();
    const workbook = new Workbook();

    const dataWorksheet = workbook.addWorksheet('Данные');

    const templateWorksheet = workbook.addWorksheet('Шаблон');
    templateWorksheet.addRow(['Направление/Специальность', profession.name]);
    templateWorksheet.addRow(['Год выпуска', new Date().getFullYear()]);
    templateWorksheet.addRow(['Образовательное учреждение', organization.name]);
    templateWorksheet.addRow([
      'Фамилия',
      'Имя',
      'Отчетсво',
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
