import { Controller, Get } from "@nestjs/common";
import { ImportService } from "./import.service";

@Controller()
export class ImportController {
  constructor(private readonly importService: ImportService) {}
}
