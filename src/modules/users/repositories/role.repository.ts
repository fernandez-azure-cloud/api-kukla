import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/shared/entities';
import { BaseRepository } from 'src/shared/repositories';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(Role)
    protected readonly userRepository: Repository<Role>,
  ) {
    super(entityManager, userRepository);
  }
}
