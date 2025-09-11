import { z } from 'zod';

const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UsuarioSchema = z.object({
    nome: z.string().min(1, 'Campo nome é obrigatório.'),
    email: z.string().email('Formato de email inválido.').min(1, 'Campo email é obrigatório.'),
    senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.').regex(senhaRegex, 'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.'),
    whatsapp: z.string().min(1, 'Campo whatsapp é obrigatório.'),
    ativo: z.boolean().optional(),
})

const UsuarioUpdateSchema = UsuarioSchema.partial();

export { UsuarioSchema, UsuarioUpdateSchema };