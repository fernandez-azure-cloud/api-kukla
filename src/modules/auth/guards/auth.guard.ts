import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/shared/decorators';
import { CryptService } from 'src/shared/services';
import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cryptService: CryptService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.authService.getTokenFromRequest(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.cryptService.verifyAsync(token);
      await this.authService.validateAccessToken(token);
      request.user = payload.user;
      request.user.role = payload.user.userRoles[0]?.role;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
