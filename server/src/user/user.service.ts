import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    const hashedPassword = this.hashPassword(createUserDto.password);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        branchId: true,
        role: true,
      },
    });
  }

  findOneByIdOrEmail(idOrEmail: string) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: idOrEmail }, { id: idOrEmail }],
      },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        branchId: true,
        role: true,
      },
    });
  }

  findMany() {
    return this.prisma.user.findMany();
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
      select: {
        id: true,
        firstName: true,
        secondName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        branchId: true,
        role: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        lastName: true,
      },
    });
  }

  private hashPassword(password: string) {
    return hashSync(password, genSaltSync(10));
  }
}
