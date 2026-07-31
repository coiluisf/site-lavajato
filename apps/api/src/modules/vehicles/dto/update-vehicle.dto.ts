import { z } from 'zod';

export const UpdateVehicleSchema = z.object({
  plate: z.string().regex(/^[A-Z]{3}\d{4}[A-Z]{2}$|^[A-Z]{3}\d{4}$/).optional(),
  make: z.string().min(2).max(100).optional(),
  model: z.string().min(2).max(100).optional(),
  color: z.string().min(2).max(50).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  categoryId: z.string().optional(),
});

export type UpdateVehicleDto = z.infer<typeof UpdateVehicleSchema>;
