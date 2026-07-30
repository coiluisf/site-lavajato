import { z } from 'zod';

export const UpdateServiceSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  duration: z.number().int().positive().optional(),
  basePrice: z.number().positive().optional(),
});

export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;
