import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isPublic } from '@shared/decorators';
import { StudentService } from '@student/student.service';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class IsActiveGuard implements CanActivate {
  constructor(
    @Inject(StudentService) private readonly studentService: StudentService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const user = req.user as IJwtPayload;
    const _isPublic = isPublic(context, this.reflector);

    if (_isPublic) {
      return true;
    }

    if (user.role !== 'Student') {
      return true;
    }

    return this.studentService
      .findOneByUserIdOrEmail(user.id)
      .then((student) => student.isActive);
  }
}
