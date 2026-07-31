import { z } from 'zod';

export const UpdateCompanySchema = z.object({
  name: z.string().min(3).max(255).optional(),
  displayName: z.string().optional(),
  cnpjCpf: z.string().regex(/^\d{11,14}$/).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  whatsapp: z.string().optional(),
  address: z.string().min(5).optional(),
});

export type UpdateCompanyDto = z.infer<typeof UpdateCompanySchema>;
