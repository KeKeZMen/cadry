import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DatabaseService } from '@database/database.service';
import { UserService } from '@user/user.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly userService: UserService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const candidate = await this.userService.findOneByIdOrEmail(
      createEmployeeDto.email,
    );

    if (candidate) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.userService.create(createEmployeeDto);

    return await this.databaseService.employee.create({
      data: {
        employeeType: createEmployeeDto.employeeType,
        branchId: createEmployeeDto.branchId,
        userId: user.id,
      },
    });
  }

  findOneByUserId(userId: string) {
    return this.databaseService.employee.findFirst({
      where: {
        userId,
      },
    });
  }

  findManyByBranchId(branchId: string) {
    return this.databaseService.employee.findMany({
      where: {
        branchId,
      },
    });
  }

  update(userId: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.databaseService.employee.update({
      where: {
        userId,
      },
      data: {
        ...updateEmployeeDto,
      },
    });
  }
}
