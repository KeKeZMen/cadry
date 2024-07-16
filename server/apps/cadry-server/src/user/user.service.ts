import { Injectable } from "@nestjs/common";
import { genSaltSync, hashSync } from "bcryptjs";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { DatabaseService } from "@libs/database";

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  create(createUserDto: Partial<CreateUserDto>) {
    const hashedPassword = this.hashPassword(createUserDto.password);

    return this.database.user.create({
      data: {
        email: createUserDto.email,
        role: createUserDto.role,
        firstName: createUserDto.firstName,
        secondName: createUserDto.secondName,
        lastName: createUserDto.lastName,
        phoneNumber: createUserDto.phoneNumber,
        password: hashedPassword,
      },
    });
  }

  findOneByIdOrEmail(idOrEmail: string) {
    return this.database.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
      select: {
        id: true,
        role: true,
        email: true,
        password: true,
        organization: {
          select: {
            id: true,
          },
        },
        employee: {
          select: {
            employeeType: true,
            branchId: true,
          },
        },
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = this.hashPassword(updateUserDto.password);

    return this.database.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
  }

  delete(id: string) {
    return this.database.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
