import { z } from 'zod';

export const RefreshSchema = z.strictObject({
  refreshToken: z.string(),
});
