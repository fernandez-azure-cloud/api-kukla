import { Injectable } from '@nestjs/common';
import { RoleRepository, UserRepository } from '../repositories';
import { DeepPartial, FindManyOptions } from 'typeorm';
import {
  CreateUserDto,
  DeleteAdvanceUserDto,
  DeleteUserDto,
  FilterListUserDto,
  FilterUserDto,
  UpdateAdvanceUserDto,
  UpdateUserDto,
} from '../dtos';
import { CryptService, NotificationService } from 'src/shared/services';
import { FieldSelectorService } from '../selectors';

import { User, UserNotification, UserRole } from 'src/shared/entities';
import { DeleteUserStatusDto } from '../dtos/delete-user-status.dto';
import { NotificationType } from 'src/shared/base';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly fieldSelectorService: FieldSelectorService,
    private readonly userRepository: UserRepository,
    private readonly notificationService: NotificationService,
    private readonly roleRepository: RoleRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async create(createDto: CreateUserDto): Promise<User> {
    const userModel: Partial<User> = {
      email: createDto.email,
      name: createDto.name,
      firstSurname: createDto.firstSurname,
      lastSurname: createDto.lastSurname,
      password: this.cryptService.cryptPassword(createDto.password),
      phone: createDto.phone,
      userRoles: [],
    };

    for (const rolId of createDto.roles) {
      const userRole = new UserRole();
      const selectFields = this.fieldSelectorService.selectFieldsForRole();
      userRole.role = await this.roleRepository.get(rolId, selectFields);
      userModel.userRoles.push(userRole);
    }

    const user = await this.userRepository.create(userModel);
    const notification = new UserNotification();
    notification.type = NotificationType.UserCreation;
    notification.user = user;
    user.password = createDto.password;
    await this.notificationService.notify(notification);
    return user;
  }

  async get(id: number): Promise<User> {
    const selectFields = this.fieldSelectorService.selectFieldsForUser();
    return await this.userRepository.get(id, selectFields);
  }

  async getInnerJoin(id: number): Promise<User> {
    return await this.userRepository.getUserWithRoles(id);
  }

  async getInnerJoinList(): Promise<User[]> {
    return await this.userRepository.getUsersWithRoles();
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const userModel: DeepPartial<User> = {
      email: data.email,
      firstSurname: data.firstSurname,
      lastSurname: data.lastSurname,
      name: data.name,
      phone: data.phone,
    };

    userModel.userRoles = data.roles.map((r) => {
      const userRole = new UserRole();
      userRole.roleId = r;
      return userRole;
    });
    return await this.userRepository.update(id, userModel);
  }

  async statusUpdate(id: number, data: DeleteUserStatusDto): Promise<User> {
    const userModel: DeepPartial<User> = {
      status: data.status,
    };
    return await this.userRepository.update(id, userModel);
  }

  async delete(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async listOf(options: FilterListUserDto): Promise<User[]> {
    const optionsFilter: FindManyOptions<User> = {
      where: { email: options.email },
      order: { name: 'ASC' },
      take: options.page,
    };
    return await this.userRepository.filterAdvance(optionsFilter);
  }

  async searchUserNameAndEmail(filterUserDto: FilterUserDto): Promise<User[]> {
    const criteria: Partial<User> = {
      email: filterUserDto.email,
      name: filterUserDto.name,
    };
    return this.userRepository.filterBasic(criteria);
  }

  async findOneAndDelete(options: DeleteUserDto): Promise<User> {
    const criteria: FindManyOptions<User> = {
      where: { id: options.id, email: options.email },
    };

    return await this.userRepository.findOneAndDelete(criteria);
  }

  async updateOne(data: UpdateAdvanceUserDto): Promise<User> {
    const findOptions: FindManyOptions<User> = {
      where: {
        id: data.id,
        name: data.name,
      },
    };

    const updatedData: DeepPartial<User> = {
      name: data.name,
      email: data.email,
    };

    return await this.userRepository.updateOne(findOptions, updatedData);
  }

  async deleteOne(deleteAdvenceDto: DeleteAdvanceUserDto): Promise<boolean> {
    const findOptions: FindManyOptions<User> = {
      where: {
        id: deleteAdvenceDto.id,
        name: deleteAdvenceDto.name,
      },
    };
    return await this.userRepository.deleteOne(findOptions);
  }

  async getByEmail(email: string): Promise<User> {
    const criteria: Partial<User> = { email };
    return await this.userRepository.search(criteria);
  }
}
