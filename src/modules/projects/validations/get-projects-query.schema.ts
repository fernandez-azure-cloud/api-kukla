import { isValid } from 'date-fns';
import { FilterType } from 'src/shared/base';
import { PaginateQuerySchema } from 'src/shared/validations';
import { z } from 'zod';

export const GetProjectsQuerySchema = PaginateQuerySchema.extend({
  type: z.enum([FilterType.Search, FilterType.Filter]).optional().nullable(),
  search: z
    .string()
    .optional()
    .transform((value) => value?.trim()),
  province: z
    .union([
      z.coerce.number().optional().nullable(),
      z.array(z.coerce.number()).optional().nullable(),
    ])
    .transform((value) => (!value || Array.isArray(value) ? value : [value])),
  department: z
    .union([
      z.coerce.number().optional().nullable(),
      z.array(z.coerce.number()).optional().nullable(),
    ])
    .transform((value) => (!value || Array.isArray(value) ? value : [value])),
  executive: z
    .union([
      z.coerce.number().optional().nullable(),
      z.array(z.coerce.number()).optional().nullable(),
    ])
    .transform((value) => (!value || Array.isArray(value) ? value : [value])),
  status: z
    .union([
      z.coerce.number().optional().nullable(),
      z.array(z.coerce.number()).optional().nullable(),
    ])
    .transform((value) => (!value || Array.isArray(value) ? value : [value])),
  region: z
    .union([
      z.coerce.number().optional().nullable(),
      z.array(z.coerce.number()).optional().nullable(),
    ])
    .transform((value) => (!value || Array.isArray(value) ? value : [value])),
  amountRange: z
    .union([
      z.coerce.number().optional().nullable(),
      z.array(z.coerce.number()).optional().nullable(),
    ])
    .transform((value) => (!value || Array.isArray(value) ? value : [value])),
  minDate: z
    .string()
    .optional()
    .nullable()
    .refine((value) => !isValid(value)),
  maxDate: z
    .string()
    .optional()
    .nullable()
    .refine((value) => !isValid(value)),
}).refine(
  (schema) =>
    !schema.maxDate ||
    !schema.minDate ||
    new Date(schema.maxDate) >= new Date(schema.minDate),
  {
    message: 'Fecha final no puede ser menor que fecha inicial.',
  },
);
