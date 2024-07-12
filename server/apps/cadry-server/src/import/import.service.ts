import { IMPORT_QUEUE } from "@libs/rmq";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ImportService {
  constructor(
    @Inject(IMPORT_QUEUE) private readonly importClient: ClientProxy
  ) {
    importClient.connect();
  }

  async test() {
    const uuid = firstValueFrom(
      this.importClient.send("import", "123-123-123-123")
    );
    return uuid;
  }
}
