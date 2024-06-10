import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkProfessionDto } from './create-work-profession.dto';

export class UpdateWorkProfessionDto extends PartialType(
  CreateWorkProfessionDto,
) {}
