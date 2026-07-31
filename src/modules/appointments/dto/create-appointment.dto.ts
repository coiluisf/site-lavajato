import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  vehicleId: z.string(),
  serviceId: z.string(),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;
