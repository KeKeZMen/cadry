import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: Partial<CreateUserDto>) {
    const hashedPassword = this.hashPassword(createUserDto.password);

    return this.prisma.user.create({
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
    return this.prisma.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
      select: {
        id: true,
        role: true,
        organization: {
          select: {
            id: true,
          },
        },
        employee: {
          select: {
            employeeType: true,
            branchId: true
          },
        },
      },
    });
  }

  findUsersByEmail(email: string) {
    return this.prisma.user.findMany({
      where: {
        email: {
          contains: email,
        },
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = this.hashPassword(updateUserDto.password);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
