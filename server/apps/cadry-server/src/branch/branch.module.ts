import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { UserModule } from '@user/user.module';

@Module({
  controllers: [BranchController],
  providers: [BranchService],
  imports: [UserModule],
  exports: [BranchService],
})
export class BranchModule {}
