import { z } from 'zod';

export const CreateRoleSchema = z.strictObject({
  name: z.string().min(2),
  descripcion: z.string().email(),
  roles: z.array(z.number()),
});
