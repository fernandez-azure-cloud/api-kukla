export class PaginateDto<T> {
  total: number;
  pageSize: number;
  pageIndex: number;
  totalPages: number;
  items: T[];
}
