import { Request, Response, NextFunction } from 'express';
import { CommonResponse } from '../helpers/commonResponse.js';

interface MongoError extends Error {
    code?: number;
    keyPattern?: any;
    keyValue?: any;
}

export class ErrorHandlerMiddleware {
    
    // Middleware para capturar e tratar todos os erros da aplicação
    static handle(erro: MongoError, req: Request, res: Response, next: NextFunction): void {
        console.error('[ErrorHandler] Erro capturado:', erro);

        // Erro de validação do MongoDB (duplicata)
        if (erro.code === 11000) {
            const response = ErrorHandlerMiddleware.handleDuplicateError(erro);
            response.send(res);
            return;
        }

        // Erro de validação do Mongoose (cast error, validation error)
        if (erro.name === 'ValidationError') {
            const response = ErrorHandlerMiddleware.handleValidationError(erro);
            response.send(res);
            return;
        }

        // Erro de cast do MongoDB (ObjectId inválido)
        if (erro.name === 'CastError') {
            const response = CommonResponse.badRequest(
                'ID inválido',
                ['O ID fornecido não é um ObjectId válido']
            );
            response.send(res);
            return;
        }

        // Erro de validação do Zod (incluindo ObjectId inválido)
        if (erro.name === 'ZodError') {
            const response = ErrorHandlerMiddleware.handleZodError(erro);
            response.send(res);
            return;
        }

        // Erro genérico
        const response = CommonResponse.error('Erro interno do servidor');
        response.send(res);
    }

    // Trata erros de duplicata do MongoDB (código 11000)
    private static handleDuplicateError(erro: MongoError): CommonResponse {
        if (erro.keyPattern && erro.keyValue) {
            const campo = Object.keys(erro.keyPattern)[0];
            const valor = erro.keyValue[campo];

            switch (campo) {
                case 'email':
                    return CommonResponse.conflict(`Email '${valor}' já está cadastrado no sistema`);
                case 'whatsapp':
                    return CommonResponse.conflict(`WhatsApp '${valor}' já está cadastrado no sistema`);
                default:
                    return CommonResponse.conflict(`${campo} já existe no sistema`);
            }
        }

        return CommonResponse.conflict('Dados duplicados encontrados');
    }

    // Trata erros de validação do Mongoose
    private static handleValidationError(erro: any): CommonResponse {
        const erros = Object.values(erro.errors).map((err: any) => ({
            campo: err.path,
            mensagem: err.message
        }));

        return CommonResponse.validationError('Dados inválidos', erros);
    }

    // Trata erros de validação do Zod
    private static handleZodError(erro: any): CommonResponse {
        const erros = erro.issues?.map((issue: any) => ({
            campo: issue.path?.join('.') || 'campo',
            mensagem: issue.message
        })) || [{ campo: 'dados', mensagem: 'Dados inválidos' }];

        // Usa a primeira mensagem como título principal
        const mensagemPrincipal = erros[0]?.mensagem || 'Dados inválidos';
        
        return CommonResponse.badRequest(mensagemPrincipal, erros);
    }
}