import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;

  @IsString()
  password: string;
}
