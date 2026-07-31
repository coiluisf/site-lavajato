import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500).optional(),
  durationMinutes: z.number().int().positive('Duração deve ser em minutos'),
});

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
