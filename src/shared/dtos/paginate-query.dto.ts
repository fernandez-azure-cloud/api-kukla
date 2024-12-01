export class PaginateQueryDto {
  pageIndex: number;
  pageSize: number;
  orderColumn: string;
  orderDirection: 'ASC' | 'DESC';
}
