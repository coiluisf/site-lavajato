import { z } from 'zod';

export const CreateVehicleSchema = z.object({
  plate: z.string().regex(/^[A-Z]{3}\d{4}[A-Z]{2}$|^[A-Z]{3}\d{4}$/, 'Placa inválida'),
  brand: z.string().min(2).max(100),
  model: z.string().min(2).max(100),
  color: z.string().min(2).max(50),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  categoryId: z.number().int().positive(),
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>;
