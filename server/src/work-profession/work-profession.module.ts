import { Module } from '@nestjs/common';
import { WorkProfessionService } from './work-profession.service';
import { WorkProfessionController } from './work-profession.controller';

@Module({
  controllers: [WorkProfessionController],
  providers: [WorkProfessionService],
  exports: [WorkProfessionService],
})
export class WorkProfessionModule {}
