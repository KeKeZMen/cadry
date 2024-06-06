import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { tmpNameSync } from 'tmp';
import { createReadStream } from 'fs';
import { Workbook } from 'exceljs';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateOrganizationUserDto,
} from './dto';
import { DirectionService } from '@direction/direction.service';
import { ProfessionService } from '@profession/profession.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly database: DatabaseService,
    private readonly directionService: DirectionService,
    private readonly professionService: ProfessionService,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return this.database.organization.create({
      data: {
        ...createOrganizationDto,
      },
    });
  }

  createOrganizationViaUser(
    createOrganizationUserDto: CreateOrganizationUserDto,
  ) {
    return this.database.organization.create({
      data: {
        ...createOrganizationUserDto,
        type: 'Organization',
      },
    });
  }

  findOneByIdOrInn(idOrInn: string) {
    return this.database.organization.findFirst({
      where: {
        OR: [{ id: idOrInn }, { inn: idOrInn }],
      },
    });
  }

  findOneByUserId(userId: string) {
    return this.database.organization.findFirst({
      where: {
        userId,
      },
    });
  }

  findOneByName(name: string) {
    return this.database.organization.findFirst({
      where: {
        name,
      },
    });
  }

  async getTemplateStream(professionId: number, organizationId: string) {
    const organization = await this.findOneByIdOrInn(organizationId);
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
      'Основная профессия',
    ]);

    await workbook.xlsx.writeFile(tmpPath);

    return createReadStream(tmpPath);
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return this.database.organization.update({
      where: {
        id,
      },
      data: {
        ...updateOrganizationDto,
      },
      select: {
        id: true,
      },
    });
  }

  remove(id: string) {
    return this.database.organization.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }
}
