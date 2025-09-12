import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ERoles } from '../../common/rolesEnum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireRoles = this.reflector.getAllAndOverride<ERoles[]>('rol', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();

    const hasRole = () =>
      requireRoles.some((role) => request.user?.roles?.includes(role));

    const valid = request.user && request.user.roles && hasRole();

    if (!valid)
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta ruta.',
      );

    return true;
  }
}
