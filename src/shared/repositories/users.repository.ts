import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/shared/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  getOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        name: true,
        password: true,
        userRoles: {
          roleId: true,
          role: {
            id: true,
            code: true,
          },
        },
      },
      relations: {
        userRoles: {
          role: true,
        },
      },
    });
  }

  getPermissions(userId: number): Promise<any> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        userRoles: {
          role: {
            roleModules: {
              module: true,
            },
            rolePermissions: {
              permission: {
                module: true,
              },
            },
          },
        },
      },
    });
  }
}
