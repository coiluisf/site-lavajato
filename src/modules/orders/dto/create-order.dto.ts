import { z } from 'zod';

export const CreateOrderSchema = z.object({
  vehicleId: z.string(),
  appointmentId: z.string().optional(),
  notes: z.string().max(500).optional(),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
