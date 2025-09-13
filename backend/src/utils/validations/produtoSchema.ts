import { z } from 'zod'

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const objectIdSchema = z.string().regex(objectIdRegex, {
    message: "ID inválido. Deve ser um ObjectId válido do MongoDB!"
})

const nomeRegex = /^[a-zA-Z0-9\s\-_.()]+$/;

export const ProdutoSchema = z.object({
    criador: objectIdSchema,
    nome_produto: z.string({
        message: "Nome do produto deve ser um texto válido!"
    })
        .min(3, 'Nome de produto deve ter no mínimo 3 caracteres!')
        .max(100, 'Nome de produto deve ter no máximo 100 caracteres!')
        .regex(nomeRegex, 'Nome pode conter letras, números, espaços e caracteres: - _ . ( )'),
    descricao: z.string({
        message: "Descrição deve ser um texto válido!"
    })
        .min(10, 'Descrição deve conter no mínimo 10 caracteres!')
        .max(500, 'Descrição deve conter no máximo 500 caracteres!'),
    preco: z.number({
        message: "Preço deve ser um número válido!"
    })
        .positive('Preço deve ser um valor positivo!')
        .max(999999.99, 'Preço não pode exceder R$ 999.999,99'),
    imagem: z
        .url('URL da imagem deve ser válida!')
        .optional(),
    ativo: z.boolean({
        message: "Status ativo deve ser verdadeiro ou falso!"
    }),
    mensagem: z.string({
        message: "Mensagem deve ser um texto válido!"
    })
        .min(5, 'Mensagem deve ter no mínimo 5 caracteres!')
        .max(200, 'Mensagem deve ter no máximo 200 caracteres!')
});

export const ProdutoEdicaoSchema = z.object({
    criador: objectIdSchema.optional(),
    nome_produto: z.string()
        .min(3, 'Nome de produto deve ter no mínimo 3 caracteres!')
        .max(100, 'Nome de produto deve ter no máximo 100 caracteres!')
        .regex(nomeRegex, 'Nome pode conter letras, números, espaços e caracteres: - _ . ( )')
        .optional(),
    descricao: z.string()
        .min(10, 'Descrição deve conter no mínimo 10 caracteres!')
        .max(500, 'Descrição deve conter no máximo 500 caracteres!')
        .optional(),
    preco: z.number()
        .positive('Preço deve ser um valor positivo!')
        .max(999999.99, 'Preço não pode exceder R$ 999.999,99')
        .optional(),
    imagem: z
        .url('URL da imagem deve ser válida!')
        .optional(),
    ativo: z.boolean().optional(),
    mensagem: z.string()
        .min(5, 'Mensagem deve ter no mínimo 5 caracteres!')
        .max(200, 'Mensagem deve ter no máximo 200 caracteres!')
        .optional()
});