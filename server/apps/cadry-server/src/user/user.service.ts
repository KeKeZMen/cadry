import { Injectable } from "@nestjs/common";
import { genSaltSync, hashSync } from "bcryptjs";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { DatabaseService } from "@libs/database";

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: Partial<CreateUserDto>) {
    const hashedPassword = this.hashPassword(createUserDto.password);

    return this.databaseService.user.create({
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
    return this.databaseService.user.findFirst({
      where: {
        OR: [{ id: idOrEmail }, { email: idOrEmail }],
      },
      select: {
        id: true,
        role: true,
        email: true,
        password: true,
        employee: {
          select: {
            employeeType: true,
            branch: {
              select: {
                id: true,
                organizationId: true,
              },
            },
          },
        },
        organization: {
          select: {
            id: true
          }
        },
      },
    });
  }

  findOneByOrganizationId(organizationId: string, userId: string) {
    return this.databaseService.user.findFirst({
      where: {
        AND: [
          { id: userId },
          {
            employee: {
              branch: {
                organizationId,
              },
            },
          },
          {
            OR: [{ role: "Employee" }, { role: "Organization" }],
          },
        ],
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const hashedPassword = this.hashPassword(updateUserDto.password);

    return this.databaseService.user.update({
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
    return this.databaseService.user.delete({
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
