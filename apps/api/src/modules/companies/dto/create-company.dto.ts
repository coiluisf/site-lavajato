import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  document: z.string().regex(/^\d{14}$/, 'CNPJ deve ter 14 dígitos'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço inválido'),
  city: z.string().min(2, 'Cidade inválida'),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
  monthlyFee: z.number().positive('Taxa mensal deve ser positiva'),
  hostingFee: z.number().positive('Taxa de hospedagem deve ser positiva'),
});

export type CreateCompanyDto = z.infer<typeof CreateCompanySchema>;
