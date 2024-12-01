import { Injectable } from '@nestjs/common';
import {
  AmountRangeRepository,
  ManagedUsersRepository,
  ProjectStatusRepository,
  ProjectsRepository,
  RegionsRepository,
  UbicationsRepository,
} from '../repositories';
import { ProjectStatus } from 'src/shared/entities/project-status.entity';
import {
  AmountRange,
  Department,
  District,
  Province,
  Region,
  User,
} from 'src/shared/entities';
import { ProjectStatusCode, RoleCode } from 'src/shared/base';
import { DateRangeDto, ProjectFiltersDto } from '../dtos';

@Injectable()
export class ProjectFiltersService {
  constructor(
    private readonly projectStatusRepository: ProjectStatusRepository,
    private readonly regionsRepository: RegionsRepository,
    private readonly ubicationRepository: UbicationsRepository,
    private readonly amountRangeRepository: AmountRangeRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly managedUsersRepository: ManagedUsersRepository,
  ) {}

  async getFilters(user: User): Promise<ProjectFiltersDto> {
    const filters = {
      executives: await this.getExecutives(user),
      status: await this.getProjectStatus(user),
      regions: await this.getRegions(user),
      departments: await this.getDepartments(user),
      provinces: await this.getProvinces(user),
      districts: await this.getDistricts(user),
      amountRanges: await this.getAmountRanges(user),
      dateRange: await this.getDateRange(user),
      defaultStatus: [],
    };
    filters.defaultStatus = this.getDefaultStatus(user, filters.status);
    return filters;
  }

  getDefaultStatus(user: User, status: ProjectStatus[]): number[] {
    const defaultStatus = {
      [RoleCode.Executive]: ProjectStatusCode.Assigned,
      [RoleCode.Manager]: ProjectStatusCode.Completed,
      [RoleCode.Administrator]: ProjectStatusCode.Approved,
    };
    return status
      .filter((s) => s.code === defaultStatus[user.role.code])
      .map((s) => s.id);
  }

  async getExecutives(user: User): Promise<User[]> {
    if (user.role.code === RoleCode.Manager) {
      return this.managedUsersRepository.getManagedUsers(user.id);
    }

    return [];
  }

  getProjectStatus(user: User): Promise<ProjectStatus[]> {
    switch (user.role.code) {
      case RoleCode.Executive:
        return this.projectStatusRepository.getAssignedProjectStatus(user.id);

      case RoleCode.Manager:
        return this.projectStatusRepository.getManagedProjectStatus(user.id);

      case RoleCode.Administrator:
        return this.projectStatusRepository.getProjectStatus();
    }
  }

  getRegions(user: User): Promise<Region[]> {
    switch (user.role.code) {
      case RoleCode.Executive:
        return this.regionsRepository.getAssignedProjectRegions(user.id);

      case RoleCode.Manager:
        return this.regionsRepository.getManagedProjectRegions(user.id);

      case RoleCode.Administrator:
        return this.regionsRepository.getProjectRegions();
    }
  }

  getDepartments(user: User): Promise<Department[]> {
    switch (user.role.code) {
      case RoleCode.Executive:
        return this.ubicationRepository.getAssignedDepartments(user.id);

      case RoleCode.Manager:
        return this.ubicationRepository.getManagedDepartments(user.id);

      case RoleCode.Administrator:
        return this.ubicationRepository.getDepartments();
    }
  }

  getProvinces(user: User): Promise<Province[]> {
    switch (user.role.code) {
      case RoleCode.Executive:
        return this.ubicationRepository.getAssignedProvinces(user.id);

      case RoleCode.Manager:
        return this.ubicationRepository.getManagedProvinces(user.id);

      case RoleCode.Administrator:
        return this.ubicationRepository.getProvinces();
    }
  }

  getDistricts(user: User): Promise<District[]> {
    switch (user.role.code) {
      case RoleCode.Executive:
        return this.ubicationRepository.getAssignedDistricts(user.id);

      case RoleCode.Manager:
        return this.ubicationRepository.getManagedDistricts(user.id);

      case RoleCode.Administrator:
        return this.ubicationRepository.getDistricts();
    }
  }

  getAmountRanges(user: User): Promise<AmountRange[]> {
    switch (user.role.code) {
      case RoleCode.Executive:
        return this.amountRangeRepository.getAssignedAmountRanges(user.id);

      case RoleCode.Manager:
        return this.amountRangeRepository.getManagedAmountRanges(user.id);

      case RoleCode.Administrator:
        return this.amountRangeRepository.getAmountRanges();
    }
  }

  getDateRange(user: User): Promise<DateRangeDto> {
    switch (user.role.code) {
      case RoleCode.Executive:
        return this.projectsRepository.getAssignedDateRange(user.id);

      case RoleCode.Manager:
        return this.projectsRepository.getManagedDateRange(user.id);

      case RoleCode.Administrator:
        return this.projectsRepository.getDateRange();
    }
  }
}
