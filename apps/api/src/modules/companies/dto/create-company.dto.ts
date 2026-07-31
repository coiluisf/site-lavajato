import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  displayName: z.string().optional(),
  cnpjCpf: z.string().regex(/^\d{11,14}$/, 'CNPJ ou CPF inválido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().min(10, 'Telefone inválido').optional(),
  whatsapp: z.string().optional(),
  address: z.string().min(5, 'Endereço inválido').optional(),
});

export type CreateCompanyDto = z.infer<typeof CreateCompanySchema>;
