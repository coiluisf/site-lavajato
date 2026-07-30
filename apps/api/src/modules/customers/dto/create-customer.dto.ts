import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string().min(3).max(255),
  document: z.string().regex(/^\d{11,14}$/, 'CPF ou CNPJ inválido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().min(10),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{8}$/),
});

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
