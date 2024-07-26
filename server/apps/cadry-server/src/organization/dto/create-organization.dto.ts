import { IsINNValide, IsPasswordMatchingConstraint } from "@libs/decorators";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";

export class CreateOrganizationDto {
  @IsNotEmpty({ message: "Поле не может быть пустым" })
  @IsString()
  name: string;

  @IsNotEmpty({ message: "Поле не может быть пустым" })
  @IsString()
  phoneNumber: string;

  @IsNotEmpty({ message: "Поле не может быть пустым" })
  @IsEmail({}, { message: "Неверный формат почты" })
  email: string;

  @IsNotEmpty({ message: "Поле не может быть пустым" })
  @IsString()
  @MinLength(6, { message: "Минимальная длина пароля 6 символов" })
  @MaxLength(12, { message: "Максимальная длина пароля 12 символов" })
  password: string;

  @IsNotEmpty({ message: "Поле не может быть пустым" })
  @IsString()
  @Validate(IsPasswordMatchingConstraint)
  passwordRepeat: string;

  @IsString()
  web: string;

  @IsNotEmpty({ message: "Поле не может быть пустым" })
  @IsString()
  address: string;

  @IsNotEmpty({ message: "Поле не может быть пустым" })
  @IsString()
  @Validate(IsINNValide)
  inn: string;
}
