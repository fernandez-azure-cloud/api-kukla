import { z } from 'zod';

export const PaginateQuerySchema = z.strictObject({
  pageIndex: z.coerce.number(),
  pageSize: z.coerce.number(),
  orderColumn: z.string(),
  orderDirection: z.enum(['ASC', 'DESC']),
});
