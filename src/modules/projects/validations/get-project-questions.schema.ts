import { z } from 'zod';

export const GetProjectQuestionsSchema = z.strictObject({
  projectId: z.coerce.number(),
});
