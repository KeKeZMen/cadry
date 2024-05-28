import { ConflictException, Injectable } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { OrganizationService } from '@organization/organization.service';
import { BranchService } from '@branch/branch.service';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly branchService: BranchService,
  ) {}

  async registerOrganization(registerDto: RegisterDto) {
    const candidate = await this.userService.findOneByIdOrEmail(
      registerDto.email,
    );

    if (candidate) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const organization = await this.organizationService.createViaInn(
      registerDto.INN,
    );

    const branch = await this.branchService.createForOrganization({
      email: registerDto.email,
      organizationId: organization.id,
    });

    return await this.userService.createForOrganization({
      email: registerDto.email,
      password: registerDto.password,
      branchId: branch.id,
    });
  }
}
