import { IsPasswordMatchingConstraint } from '@shared/decorators/isPasswordMatching';
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  INN: string;

  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  @MaxLength(12, { message: 'Максимальная длина пароля 12 символов' })
  password: string;

  @IsString()
  @Validate(IsPasswordMatchingConstraint)
  repeatPassword: string;
}
