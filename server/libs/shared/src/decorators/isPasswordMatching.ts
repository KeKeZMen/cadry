import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { RegisterDto } from "@auth/dto";

@ValidatorConstraint({ name: "IsPasswordMatching", async: false })
export class IsPasswordMatchingConstraint
  implements ValidatorConstraintInterface
{
  validate(passwordRepeat: string, validationArguments?: ValidationArguments) {
    const obj = validationArguments.object as RegisterDto;
    return obj.password === passwordRepeat;
  }

  defaultMessage(): string {
    return "Пароли не совпадают";
  }
}
