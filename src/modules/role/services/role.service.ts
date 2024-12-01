import { Injectable } from '@nestjs/common';
import { DeepPartial, FindManyOptions } from 'typeorm';
import {
  DeleteAdvanceRoleDto,
  DeleteRoleDto,
  FilterListRoleDto,
  FilterRoleDto,
  UpdateAdvanceRoleDto,
  UpdateRoleDto,
} from '../dtos';
import { CryptService } from 'src/shared/services';
import { FieldSelectorService } from '../selectors';
import { Role, User } from 'src/shared/entities';
import { RoleRepository } from '../repositories/role-repository';
import { CreateRoleDto } from '../dtos/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly fieldSelectorService: FieldSelectorService,
    private readonly roleRepository: RoleRepository,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.getAll();
  }

  async create(createDto: CreateRoleDto): Promise<Role> {
    const roleModel: Partial<Role> = {
      // code: 'createDto.name',
      description: 'createDto'
    };

    return await this.roleRepository.create(roleModel);
  }

  async get(id: number): Promise<Role> {
    const selectFields = this.fieldSelectorService.selectFieldsForUser();
    return await this.roleRepository.get(id, selectFields);
  }

  async update(id: number, data: UpdateRoleDto): Promise<Role> {
    const userModel: DeepPartial<User> = {
      email: data.email,
      name: data.name,
    };
    return await this.roleRepository.update(id, userModel);
  }

  async delete(id: number): Promise<boolean> {
    return await this.roleRepository.delete(id);
  }

  async listOf(options: FilterListRoleDto): Promise<Role[]> {
    const optionsFilter: FindManyOptions<Role> = {
      where: { description: options.description },
      order: { description: 'ASC' },
      take: options.page,
    };
    return await this.roleRepository.filterAdvance(optionsFilter);
  }

  async searchUserNameAndEmail(filterUserDto: FilterRoleDto): Promise<Role[]> {
    const criteria: Partial<User> = {
      email: filterUserDto.email,
      name: filterUserDto.name,
    };
    return this.roleRepository.filterBasic(criteria);
  }

  async findOneAndDelete(options: DeleteRoleDto): Promise<Role> {
    const criteria: FindManyOptions<Role> = {
      where: { id: options.id, description: options.email },
    };

    return await this.roleRepository.findOneAndDelete(criteria);
  }

  async updateOne(data: UpdateAdvanceRoleDto): Promise<Role> {
    const findOptions: FindManyOptions<Role> = {
      where: {
        id: data.id,
        description: data.name,
      },
    };

    const updatedData: DeepPartial<User> = {
      name: data.name,
      email: data.email,
    };

    return await this.roleRepository.updateOne(findOptions, updatedData);
  }

  async deleteOne(deleteAdvenceDto: DeleteAdvanceRoleDto): Promise<boolean> {
    const findOptions: FindManyOptions<Role> = {
      where: {
        id: deleteAdvenceDto.id,
        description: deleteAdvenceDto.name,
      },
    };
    return await this.roleRepository.deleteOne(findOptions);
  }

  async getByEmail(email: string): Promise<Role> {
    const criteria: Partial<User> = { email };
    return await this.roleRepository.search(criteria);
  }
}
