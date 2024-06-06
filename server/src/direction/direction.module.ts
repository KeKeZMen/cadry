import { Module } from '@nestjs/common';
import { DirectionService } from './direction.service';
import { DirectionController } from './direction.controller';
import { DatabaseModule } from '@database/database.module';

@Module({
  controllers: [DirectionController],
  providers: [DirectionService],
  imports: [DatabaseModule],
  exports: [DirectionService],
})
export class DirectionModule {}
