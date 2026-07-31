import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  name: z.string().min(3).max(255),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido'),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  role: z.enum(['OWNER', 'MANAGER', 'ATTENDANT', 'WASHER', 'FINANCE', 'OTHER']),
});

export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;
