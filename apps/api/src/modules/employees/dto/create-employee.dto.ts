import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  role: z.enum(['gerente', 'lavador', 'atendente', 'admin']),
});

export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;
