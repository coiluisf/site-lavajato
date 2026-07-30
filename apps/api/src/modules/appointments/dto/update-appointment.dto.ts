import { z } from 'zod';

export const UpdateAppointmentSchema = z.object({
  appointmentDate: z.string().datetime().optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  employeeId: z.number().int().positive().optional(),
});

export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentSchema>;
