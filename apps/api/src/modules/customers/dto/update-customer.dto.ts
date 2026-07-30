import { z } from 'zod';

export const UpdateCustomerSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  document: z.string().regex(/^\d{11,14}$/).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().length(2).optional(),
  zipCode: z.string().regex(/^\d{8}$/).optional(),
});

export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
