import { Module } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { ProfessionController } from './profession.controller';
import { DatabaseModule } from '@database/database.module';

@Module({
  controllers: [ProfessionController],
  providers: [ProfessionService],
  imports: [DatabaseModule],
  exports: [ProfessionService],
})
export class ProfessionModule {}
