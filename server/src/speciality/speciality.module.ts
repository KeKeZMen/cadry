import { Module } from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { SpecialityController } from './speciality.controller';
import { DatabaseModule } from '@database/database.module';

@Module({
  controllers: [SpecialityController],
  providers: [SpecialityService],
  imports: [DatabaseModule],
})
export class SpecialityModule {}
