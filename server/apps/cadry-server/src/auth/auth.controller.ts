import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Cookie, Public, UserAgent } from "@libs/decorators";
import { RegisterDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
import { Response } from "express";
import { Tokens } from "./interfaces";

const REFRESH_TOKEN = "refreshToken";

@Public()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post("register-organization")
  async registerOrganization(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
    @UserAgent() userAgent: string
  ) {
    await this.authService.registerOrganization(registerDto);

    const tokens = await this.authService.login(registerDto, userAgent);

    if (!tokens) {
      throw new BadRequestException("Не удалось авторизоваться");
    }

    this.setRefreshTokenToCookies(tokens, res);

    res.json({ accessToken: tokens.accessToken, user: tokens.user });
  }

  @Post("login")
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @UserAgent() userAgent: string
  ) {
    const tokens = await this.authService.login(loginDto, userAgent);

    if (!tokens) {
      throw new BadRequestException("Не удалось авторизоваться");
    }

    this.setRefreshTokenToCookies(tokens, res);

    res.json({ accessToken: tokens.accessToken, user: tokens.user });
  }

  @Get("refresh")
  async refresh(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
    @UserAgent() userAgent: string
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokens = await this.authService.refreshTokens(
      refreshToken,
      userAgent
    );

    if (!tokens) {
      throw new UnauthorizedException();
    }

    this.setRefreshTokenToCookies(tokens, res);

    res.json({ accessToken: tokens.accessToken, user: tokens.user });
  }

  @Get("logout")
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }

    await this.authService.deleteRefreshToken(refreshToken);

    res.cookie(REFRESH_TOKEN, "", {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });

    res.sendStatus(HttpStatus.OK);
  }

  private setRefreshTokenToCookies(tokens: Tokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(tokens.refreshToken.exp),
    });
  }
}
