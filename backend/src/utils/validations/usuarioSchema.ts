import { z } from 'zod';

const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UsuarioSchema = z.object({
    nome: z.string({message: 'Campo nome é obrigatório.'}).min(3, 'Campo nome é obrigatório.'),
    email: z.string({message: 'Campo email é obrigatório.'}).email('Formato de email inválido.').min(1, 'Campo email é obrigatório.'),
    senha: z.string({message: 'A senha deve ter pelo menos 8 caracteres.'}).min(8, 'A senha deve ter pelo menos 8 caracteres.').regex(senhaRegex, 'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.'),
    whatsapp: z.string({message: 'Campo whatsapp é obrigatório.'}).min(10, 'Campo whatsapp é obrigatório.'),
    ativo: z.boolean().optional(),
})

const UsuarioUpdateSchema = UsuarioSchema.partial();

export { UsuarioSchema, UsuarioUpdateSchema };