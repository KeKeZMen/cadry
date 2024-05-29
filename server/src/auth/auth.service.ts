import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { OrganizationService } from '@organization/organization.service';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
  ) {}

  async registerOrganization(registerDto: RegisterDto) {
    const candidate = await this.userService.findOneByIdOrEmail(
      registerDto.email,
    );

    if (candidate) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const user = await this.userService.create({
      email: registerDto.email,
      password: registerDto.password,
      role: 'Organization',
    });

    return await this.organizationService.createOrganizationViaUser({
      userId: user.id,
      email: registerDto.email,
      inn: registerDto.inn,
    });
  }
}
