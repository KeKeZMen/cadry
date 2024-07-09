import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TYPES_KEY } from '@libs/decorators';
import { UserService } from '@user/user.service';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class EmployeeTypesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredTypes = this.reflector.getAllAndOverride<string[]>(
      TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTypes) {
      return true;
    }

    const req = context.switchToHttp().getRequest() as Request;
    const user = req.user as IJwtPayload;

    if (user.role !== 'Employee') {
      return true;
    }

    return this.userService
      .findOneByIdOrEmail(user.id)
      .then((data) => requiredTypes.includes(data.employee.employeeType));
  }
}
