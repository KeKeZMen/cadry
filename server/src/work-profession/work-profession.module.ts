import { Module } from '@nestjs/common';
import { WorkProfessionService } from './work-profession.service';
import { DatabaseModule } from '@database/database.module';
import { WorkProfessionController } from './work-profession.controller';

@Module({
  controllers: [WorkProfessionController],
  providers: [WorkProfessionService],
  imports: [DatabaseModule],
  exports: [WorkProfessionService],
})
export class WorkProfessionModule {}
