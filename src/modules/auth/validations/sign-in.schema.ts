import { z } from 'zod';

export const SignInSchema = z.strictObject({
  email: z.string().email(),
  password: z.string(),
});
