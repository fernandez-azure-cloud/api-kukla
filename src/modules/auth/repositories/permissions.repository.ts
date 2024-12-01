import { Injectable } from '@nestjs/common';
import { Permission } from 'src/shared/entities';
import { EntityManager } from 'typeorm';

@Injectable()
export class PermissionsRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async hasPermission(
    roleId: number,
    path: string,
    method: string,
    action?: string,
  ): Promise<boolean> {
    let qb = this.entityManager.connection
      .createQueryBuilder(Permission, 'permission')
      .leftJoin('permission.module', 'module')
      .leftJoin('permission.rolePermissions', 'role_permission')
      .leftJoin('module.roleModules', 'role_module')
      .select([])
      .where(
        'permission.method = :method and permission.resource = :path and (role_permission.roleId = :roleId or role_module.roleId = :roleId)',
        { roleId, path, method },
      );

    if (action) {
      qb = qb.andWhere('permission.code = :action', { action });
    }

    const result = await qb.getCount();
    return result > 0;
  }
}
