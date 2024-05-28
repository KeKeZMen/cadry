import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '@shared/decorators';
import { RegisterDto } from './dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async registerOrganization(@Body() registerDto: RegisterDto) {
    return await this.authService.registerOrganization(registerDto);
  }
}
