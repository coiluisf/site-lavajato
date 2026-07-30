import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  vehicleId: z.number().int().positive(),
  serviceId: z.number().int().positive(),
  appointmentDate: z.string().datetime(),
  notes: z.string().max(500).optional(),
  employeeId: z.number().int().positive().optional(),
});

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;
