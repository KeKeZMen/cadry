import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { OrganizationService } from '@organization/organization.service';
import { RegisterDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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

  async login(loginDto: LoginDto, userAgent: string) {
    const user = await this.userService.findOneByIdOrEmail(loginDto.email);

    if (!user || !compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return this.generateTokens(user, userAgent);
  }

  async refreshTokens(refreshToken: string, userAgent: string) {
    const token = await this.prisma.token.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.prisma.token.delete({
      where: {
        token: refreshToken,
      },
    });

    if (new Date(token.exp) < new Date()) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOneByIdOrEmail(token.userId);
    return this.generateTokens(user, userAgent);
  }

  async deleteRefreshToken(token: string) {
    return await this.prisma.token.delete({
      where: {
        token,
      },
    });
  }

  private async generateTokens(user: Partial<User>, userAgent: string) {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

    const refreshToken = await this.getRefreshToken(user.id, userAgent);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async getRefreshToken(userId: string, userAgent: string) {
    const _token = await this.prisma.token.findFirst({
      where: {
        userId,
        userAgent,
      },
    });

    const token = _token?.token ?? '';

    return await this.prisma.token.upsert({
      where: {
        token,
      },
      update: {
        exp: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
        token: randomUUID(),
      },
      create: {
        userId,
        userAgent,
        exp: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
        token: randomUUID(),
      },
    });
  }
}
