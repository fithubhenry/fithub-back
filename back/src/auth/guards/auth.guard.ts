import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ENV from '../../config/enviroments';
import { Observable } from 'rxjs';
import { ERoles } from '../../common/rolesEnum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers?.authorization?.split(' ')[1];
    if (!token) throw new UnauthorizedException('No se ha enviado Token');

    try {
      const secret = ENV.JWTSECRET;
      const payload = this.jwtService.verify(token, { secret });
      payload.roles = payload.isAdmin ? [ERoles.Admin] : [ERoles.User];
      payload.iat = new Date(payload.iat * 1000);
      payload.exp = new Date(payload.exp * 1000);

      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Error al validar Token');
    }
  }
}
