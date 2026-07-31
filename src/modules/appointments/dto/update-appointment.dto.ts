import { z } from 'zod';

export const UpdateAppointmentSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
});

export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentSchema>;
