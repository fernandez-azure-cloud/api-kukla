import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from 'src/shared/repositories';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role} from 'src/shared/entities';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Role)
    protected readonly roleRepository: Repository<Role>,
  ) {
    super(entityManager, roleRepository);
  }
}
