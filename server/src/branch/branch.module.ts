import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { PrismaModule } from '@prisma/prisma.module';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  imports: [PrismaModule],
  exports: [BranchService],
})
export class BranchModule {}
