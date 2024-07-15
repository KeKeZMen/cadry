import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "@user/user.service";
import { OrganizationService } from "@organization/organization.service";
import { RegisterDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { compareSync } from "bcryptjs";
import { DatabaseService } from "@libs/database";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly jwtService: JwtService,
    private readonly database: DatabaseService
  ) {}

  async registerOrganization(registerDto: RegisterDto) {
    const emailCandidate = await this.userService.findOneByIdOrEmail(
      registerDto.email
    );

    if (emailCandidate) {
      throw new ConflictException("Организация с таким email уже существует");
    }

    const innCandidate = await this.organizationService.findOneByIdOrInn(
      registerDto.inn
    );

    if (innCandidate) {
      throw new ConflictException("Организация с таким ИНН уже существует");
    }

    const user = await this.userService.create({
      email: registerDto.email,
      password: registerDto.password,
      role: "Organization",
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
      throw new UnauthorizedException("Неверный логин или пароль");
    }

    return await this.generateTokens(user, userAgent);
  }

  async refreshTokens(refreshToken: string, userAgent: string) {
    const token = await this.database.token.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    await this.database.token.delete({
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
    return await this.database.token.delete({
      where: {
        token,
      },
    });
  }

  private async generateTokens(user: Partial<User>, userAgent: string) {
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      { expiresIn: "15m" }
    );

    const refreshToken = await this.getRefreshToken(user.id, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  private async getRefreshToken(userId: string, userAgent: string) {
    const _token = await this.database.token.findFirst({
      where: {
        userId,
        userAgent,
      },
    });

    const token = _token?.token ?? "";

    return await this.database.token.upsert({
      where: {
        token,
      },
      update: {
        exp: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        token: randomUUID(),
      },
      create: {
        userId,
        userAgent,
        exp: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        token: randomUUID(),
      },
    });
  }
}
