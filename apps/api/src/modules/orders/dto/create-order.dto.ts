import { z } from 'zod';

export const CreateOrderSchema = z.object({
  vehicleId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
  appointmentId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
