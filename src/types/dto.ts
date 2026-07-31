import { z } from 'zod';

// Customer DTOs
export const CreateCustomerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  address: z.string().optional(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
export interface Customer extends CreateCustomerDto {
  id: number;
  createdAt: string;
}

// Service DTOs
export const CreateServiceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  basePrice: z.number().positive('Preço deve ser positivo'),
  duration: z.number().positive('Duração deve ser positiva'),
});

export const UpdateServiceSchema = CreateServiceSchema.partial();

export type CreateServiceDto = z.infer<typeof CreateServiceSchema>;
export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;
export interface Service extends CreateServiceDto {
  id: number;
  createdAt: string;
}

// Appointment DTOs
export const CreateAppointmentSchema = z.object({
  customerId: z.number().positive(),
  serviceId: z.number().positive(),
  appointmentDate: z.string(),
  startTime: z.string(),
  notes: z.string().optional(),
});

export const UpdateAppointmentSchema = CreateAppointmentSchema.partial();

export type CreateAppointmentDto = z.infer<typeof CreateAppointmentSchema>;
export type UpdateAppointmentDto = z.infer<typeof UpdateAppointmentSchema>;
export interface Appointment extends CreateAppointmentDto {
  id: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

// Order DTOs
export const CreateOrderSchema = z.object({
  appointmentId: z.number().positive(),
  customerId: z.number().positive(),
  totalPrice: z.number().positive('Preço deve ser positivo'),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'completed', 'cancelled']),
});

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof UpdateOrderStatusSchema>;
export interface Order extends CreateOrderDto {
  id: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

// Company Stats
export interface CompanyStats {
  totalCustomers: number;
  totalServices: number;
  totalAppointments: number;
  totalRevenue: number;
}

// Revenue
export interface Revenue {
  total: number;
  byDay: Record<string, number>;
}
