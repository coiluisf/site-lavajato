import { z } from 'zod';

export const UpdateEmployeeSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['gerente', 'lavador', 'atendente', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeSchema>;
