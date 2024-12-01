import { ProjectAction } from 'src/shared/base';
import { z } from 'zod';

export const UpdateProjectSchema = z
  .strictObject({
    action: z.enum([ProjectAction.Save, ProjectAction.Send]),
    responses: z
      .array(
        z.strictObject({
          questionId: z.number(),
          response: z.union([z.string(), z.number()]).optional().nullable(),
        }),
      )
      .optional()
      .nullable(),
  })
  .refine((schema) => validateSchema(schema));

const validateSchema = (schema) => {
  if (schema.action === ProjectAction.Save) {
    return schema.responses;
  }

  return true;
};
