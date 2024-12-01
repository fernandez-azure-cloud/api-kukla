import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ProjectAuthorizationService } from '../services';

@Injectable()
export class ProjectGuard implements CanActivate {
  constructor(
    private readonly projectAuthorizationService: ProjectAuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const param = request.params?.id;
    const query = request.query?.projectId;

    if (!param && !query) return false;

    const hasPermission =
      await this.projectAuthorizationService.getAuthorization(
        Number(param ?? query),
        user,
      );
    return hasPermission;
  }
}
