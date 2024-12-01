import {
  AmountRange,
  Department,
  District,
  Province,
  Region,
  User,
} from 'src/shared/entities';
import { ProjectStatus } from 'src/shared/entities/project-status.entity';
import { DateRangeDto } from './date-range.dto';

export class ProjectFiltersDto {
  executives: User[];
  status: ProjectStatus[];
  regions: Region[];
  departments: Department[];
  provinces: Province[];
  districts: District[];
  amountRanges: AmountRange[];
  dateRange: DateRangeDto;
  defaultStatus: number[];
}
