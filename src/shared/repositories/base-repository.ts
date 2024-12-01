import {
  Repository,
  EntityManager,
  FindManyOptions,
  DeepPartial,
  Like,
  FindOptionsWhere,
  FindOneOptions,
  FindOptionsSelect,
} from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly repository: Repository<T>,
  ) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async get(id: number, selectFields: string[]): Promise<T | undefined> {
    const options: FindOneOptions<T> = {
      where: { id } as unknown as FindOptionsWhere<T>,
      select: selectFields.reduce((acc, curr) => {
        acc[curr] = true;
        return acc;
      }, {} as FindOptionsSelect<T>),
    };
    return await this.repository.findOne(options);
  }

  async getUserWithRoles(id: number): Promise<T | undefined> {
    const options: FindOneOptions<T> = { 
      where: { id } as unknown as FindOptionsWhere<T>,
      relations: ['roles'] // Aquí defines la relación con la tabla de roles
    };
    const user = await this.repository.findOne(options);
    return user;
  }

  async update(id: number, data: DeepPartial<T>): Promise<T | undefined> {
    const entity = await this.repository.findOne({
      where: { id },
    } as unknown as FindOptionsWhere<T>);
    if (!entity) {
      return null;
    }

    this.repository.merge(entity, data);
    return this.repository.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async getAll(): Promise<T[]> {
    
    return (await this.repository.find());
  }

  async filterAdvance(options: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async filterBasic(criteria: Partial<T>): Promise<T[]> {
    const options = { where: criteria } as FindManyOptions<T>;
    return this.repository.find(options);
  }

  async search(criteria: Partial<T>): Promise<T> {
    const options: FindManyOptions<T> = {};
    for (const key in criteria) {
      if (criteria.hasOwnProperty(key)) {
        options.where = { ...options.where, [key]: Like(`%${criteria[key]}%`) };
      }
    }
    return this.repository.findOne(options);
  }

  async findOneAndDelete(options: FindManyOptions<T>): Promise<T | undefined> {
    const entity = await this.repository.findOne(options);
    if (entity) {
      await this.repository.remove(entity);
    }
    return entity;
  }

  async updateOne(
    options: FindManyOptions<T>,
    data: DeepPartial<T>,
  ): Promise<T | undefined> {
    const entity = await this.repository.findOne(options);
    if (entity) {
      const updatedEntity = await this.repository.save({
        ...entity,
        ...data,
      });
      return updatedEntity;
    }
    return undefined;
  }

  async deleteOne(options: FindManyOptions<T>): Promise<boolean> {
    const entity = await this.repository.findOne(options);
    if (entity) {
      const entityId = this.getEntityId(entity);
      if (entityId) {
        const result = await this.repository.delete(entityId);
        return result.affected > 0;
      }
    }
    return false;
  }

  protected getEntityId(entity: T): any {
    const metadata = this.repository.metadata;
    const primaryKeys = metadata.primaryColumns.map(
      (column) => column.propertyName,
    );
    const entityId = {};
    for (const key of primaryKeys) {
      entityId[key] = (entity as any)[key];
    }
    return entityId;
  }
}
