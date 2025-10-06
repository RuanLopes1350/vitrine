import { z } from 'zod';

const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const UsuarioSchema = z.object({
    nome: z.string({message: 'Campo nome é obrigatório.'}).min(3, 'Campo nome deve conter pelo menos 3 caracteres.'),
    nomeLoja: z.string({message: 'Campo nome da loja é obrigatório.'}).min(3, 'Campo nome da loja deve conter pelo menos 3 caracteres.'),
    whatsapp: z.string({message: 'Campo whatsapp é obrigatório.'}).min(10, 'Campo whatsapp deve conter pelo menos 10 caracteres.').max(11, 'Campo whatsapp deve conter no máximo 11 caracteres.'), 
    email: z.string({message: 'Campo email é obrigatório.'}).email('Formato de email inválido.'),
    senha: z.string({message: 'A senha deve ter pelo menos 8 caracteres.'}).min(8, 'A senha deve ter pelo menos 8 caracteres.').regex(senhaRegex, 'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.'),
    fotoPerfil: z.string().url('URL da foto de perfil inválida').optional(),
    ativo: z.boolean().optional(),
})

const UsuarioUpdateSchema = UsuarioSchema.partial();

export { UsuarioSchema, UsuarioUpdateSchema };