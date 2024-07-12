import { IMPORT_QUEUE } from "@libs/rmq";
import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { writeFile } from "fs/promises";

@Injectable()
export class ImportService {
  constructor(
    @Inject(IMPORT_QUEUE) private readonly importClient: ClientProxy
  ) {
    importClient.connect();
  }

  async import(file: Express.Multer.File, uuid: string) {
    const filePath = `files/${uuid}.xlsx`;
    await writeFile(filePath, file.buffer);

    const data = await firstValueFrom(this.importClient.send("import", uuid));

    if (data.status >= 400) {
      throw new HttpException(data.message, data.status);
    }

    return data;
  }
}
