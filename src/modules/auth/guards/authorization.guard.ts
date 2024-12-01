import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../services';
import { IS_PUBLIC_KEY } from 'src/shared/decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const { body, method, route, user } = request;
    const action = body?.action;
    const path = route.path;
    return this.authService.validateAuthorization(user, path, method, action);
  }
}
