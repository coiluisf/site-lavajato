import { z } from 'zod';

export const UpdateEmployeeSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  role: z.enum(['OWNER', 'MANAGER', 'ATTENDANT', 'WASHER', 'FINANCE', 'OTHER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeSchema>;
