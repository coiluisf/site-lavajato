import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string().min(3).max(255),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().min(10),
  whatsapp: z.string().optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().length(2).optional(),
});

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
