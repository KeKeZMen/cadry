import { IsINNValide } from '@shared/decorators/isINNValide';
import { IsPasswordMatchingConstraint } from '@shared/decorators/isPasswordMatching';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsINNValide)
  inn: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Минимальная длина пароля 6 символов' })
  @MaxLength(12, { message: 'Максимальная длина пароля 12 символов' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsPasswordMatchingConstraint)
  passwordRepeat: string;
}
