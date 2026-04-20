import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória')
});

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  papel_id: z.number().optional()
});

export const pessoaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  papel_id: z.number().optional(),
  agrupamento_id: z.number().optional(),
  observacao: z.string().optional()
});

export const eventoSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  data: z.string().optional(),
  regiao_id: z.number().optional(),
  descricao: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export const checkinSchema = z.object({
  pessoa_id: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  foto: z.string().optional()
});

export const vinculoSchema = z.object({
  pessoa_id: z.number(),
  pessoa_relacionada_id: z.number(),
  tipo: z.enum(['ASSESSOR', 'LIDER', 'CANDIDATO'])
});

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(i => i.message);
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}