export class ColumnDecimalTransformer {
  to(data: number): number | null {
    return data;
  }

  from(data: string | null): number | null {
    return data?.length > 0 ? Number(data) : null;
  }
}
