import { Controller, Get } from '@nestjs/common';
import { ProjectFiltersService } from '../services';
import { ProjectStatus } from 'src/shared/entities/project-status.entity';
import { RequestUser } from 'src/shared/decorators';
import {
  AmountRange,
  Department,
  District,
  Province,
  Region,
  User,
} from 'src/shared/entities';
import { DateRangeDto, ProjectFiltersDto } from '../dtos';

@Controller('project-filters')
export class ProjectFiltersController {
  constructor(private readonly projectFiltersService: ProjectFiltersService) {}

  @Get()
  getFilters(@RequestUser() user: User): Promise<ProjectFiltersDto> {
    return this.projectFiltersService.getFilters(user);
  }

  @Get('status')
  getProjectStatus(@RequestUser() user: User): Promise<ProjectStatus[]> {
    return this.projectFiltersService.getProjectStatus(user);
  }

  @Get('regions')
  getProjectRegions(@RequestUser() user: User): Promise<Region[]> {
    return this.projectFiltersService.getRegions(user);
  }

  @Get('departments')
  getProjectDepartments(@RequestUser() user: User): Promise<Department[]> {
    return this.projectFiltersService.getDepartments(user);
  }

  @Get('provinces')
  getProjectProvinces(@RequestUser() user: User): Promise<Province[]> {
    return this.projectFiltersService.getProvinces(user);
  }

  @Get('districts')
  getProjectDistricts(@RequestUser() user: User): Promise<District[]> {
    return this.projectFiltersService.getDistricts(user);
  }

  @Get('amount-range')
  getProjectAmountRange(@RequestUser() user: User): Promise<AmountRange[]> {
    return this.projectFiltersService.getAmountRanges(user);
  }

  @Get('date-range')
  getProjectDateRange(@RequestUser() user: User): Promise<DateRangeDto> {
    return this.projectFiltersService.getDateRange(user);
  }
}
