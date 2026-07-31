import { z } from 'zod';

export const UpdateCustomerSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  cpf: z.string().regex(/^\d{11}$/).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  whatsapp: z.string().optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().length(2).optional(),
});

export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
