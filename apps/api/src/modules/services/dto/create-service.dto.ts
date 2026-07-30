import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500).optional(),
  duration: z.number().int().positive('Duração deve ser em minutos'),
  basePrice: z.number().positive('Preço base deve ser positivo'),
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
