import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import * as ExcelJs from "exceljs"
import * as tmp from "tmp"
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  CreateOrganizationUserDto,
} from './dto';
import { Stream } from 'stream';

@Injectable()
export class OrganizationService {
  constructor(private readonly database: DatabaseService) {}

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

  async getDocumentTemplateStream() {
    const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({ filename: "Шаблон", useStyles: true })
    const templateWorksheet = workbook.addWorksheet("Шаблон") 
    const dataWorksheet = workbook.addWorksheet("Данные")
    
    const stream = new Stream()

    stream.on("data", () => {
      dataWorksheet.columns = [
        { key: "lastName", header: "Фамилия" },
        { key: "firstName", header: "Фамилия" },
      ]
    })

    stream.on("end", () => {})
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
