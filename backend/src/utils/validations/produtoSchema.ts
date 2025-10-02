import { z } from 'zod'
import objectIdSchema from './objectIdSchema.js';

const nomeRegex = /^[\p{L}0-9\s\-_.!()]+$/u;

const ProdutoSchema = z.object({
    criador: objectIdSchema,
    nome_produto: z.string({message: 'Nome do produto é obrigatório!'})
        .min(3, 'Nome de produto deve ter no mínimo 3 caracteres!')
        .max(100, 'Nome de produto deve ter no máximo 100 caracteres!')
        .regex(nomeRegex, 'Nome só pode conter letras, números, espaços e caracteres: - _ . ! ( )'),
    descricao: z.string()
        .nonempty('Descrição é obrigatória!')
        .min(10, 'Descrição deve conter no mínimo 10 caracteres!')
        .max(500, 'Descrição deve conter no máximo 500 caracteres!'),
    preco: z.number()
        .positive('Preço deve ser um valor positivo!')
        .max(999999.99, 'Preço não pode exceder R$ 999.999,99'),
    imagem: z
        .url('URL da imagem deve ser válida!')
        .optional(),
    ativo: z.boolean(),
    mensagem: z.string()
        .nonempty('Mensagem é obrigatória!')
        .min(5, 'Mensagem deve ter no mínimo 5 caracteres!')
        .max(200, 'Mensagem deve ter no máximo 200 caracteres!')
});

const ProdutoUpdateSchema = ProdutoSchema.partial();

export { ProdutoSchema, ProdutoUpdateSchema, objectIdSchema };