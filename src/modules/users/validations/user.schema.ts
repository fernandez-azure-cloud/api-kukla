import { z } from 'zod';

export const CreateUserSchema = z.strictObject({
  name: z.string().min(2),
  firstSurname: z.string().min(2),
  lastSurname: z.string().min(2),
  phone: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  roles: z.array(z.number()).optional(),
});
