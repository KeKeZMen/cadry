import { RegisterDto } from '@auth/dto';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isINNValide', async: false })
export class IsINNValide implements ValidatorConstraintInterface {
  validate(
    _: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const obj = validationArguments.object as RegisterDto;
    const { inn } = obj;

    return inn.length === 10 || inn.length === 12;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Недопустимый ИНН';
  }
}
