import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { genSaltSync, hashSync } from 'bcrypt';
import { CreateUserDto, CreateOrganizationUserDto, UpdateUserDto } from './dto';

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
        email: true,
        role: true,
      },
    });
  }

  createForOrganization(organizationUser: CreateOrganizationUserDto) {
    const hashedPassword = this.hashPassword(organizationUser.password);

    return this.prisma.user.create({
      data: {
        email: organizationUser.email,
        password: hashedPassword,
        role: 'Manager',
      },
      select: {
        id: true,
        email: true,
        role: true,
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
        firstName: true,
        secondName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true,
        branch: {
          select: {
            id: true,
            organizationId: true,
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
      select: {
        id: true,
        firstName: true,
        secondName: true,
        lastName: true,
        email: true,
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
      select: {
        id: true,
        firstName: true,
        secondName: true,
        lastName: true,
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
