import { EntityManager, Repository } from 'typeorm';
import { BaseRepository } from 'src/shared/repositories';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    protected readonly entityManager: EntityManager,
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {
    super(entityManager, userRepository);
  }

  async getUserWithRoles(id: number): Promise<User | undefined> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
  }

  async getUsersWithRoles(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .orderBy('user.id', 'ASC') 
      .getMany();
  }
}
