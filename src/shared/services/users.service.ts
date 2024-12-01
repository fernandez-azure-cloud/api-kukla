import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { User } from 'src/shared/entities';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async createUser(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }

  getOneByEmail(email: string): Promise<User> {
    return this.userRepository.getOneByEmail(email);
  }

  async getPermissions(userId: number): Promise<any> {
    return this.userRepository.getPermissions(userId);
  }
}
