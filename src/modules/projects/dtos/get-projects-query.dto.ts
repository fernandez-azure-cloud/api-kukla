import { FilterType } from 'src/shared/base';
import { PaginateQueryDto } from 'src/shared/dtos';

export class GetProjectsQueryDto extends PaginateQueryDto {
  type?: FilterType;
  search?: string;
  executive?: number[];
  status?: number[];
  region?: number[];
  province?: number[];
  department?: number[];
  amountRange?: number[];
  minDate?: string;
  maxDate?: string;
}
