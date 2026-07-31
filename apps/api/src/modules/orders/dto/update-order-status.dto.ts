import { z } from 'zod';

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['DRAFT', 'WAITING', 'IN_PREPARATION', 'IN_SERVICE', 'QUALITY_CHECK', 'READY', 'DELIVERED', 'CANCELLED']),
});

export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;
