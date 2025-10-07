import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import ServiceProduto from "../service/serviceProduto.js";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto.js";
import { CommonResponse } from "../utils/helpers/commonResponse.js";
import HttpStatusCodes from "../utils/helpers/httpStatusCodes.js";
import objectIdSchema from "../utils/validations/objectIdSchema.js";

class ControllerProduto {
    private service: ServiceProduto

    constructor() {
        this.service = new ServiceProduto();
    }

    async validar(req: Request, res: Response, next: NextFunction): Promise<void> {
        const dadosProduto: typeProduto = req.body;
        const userId = (req as AuthenticatedRequest).user_id;

        console.log('Validando dados do produto para usuário:', userId);
        try {
            // Adicionar o criador aos dados do produto para validação
            const produtoComCriador = {
                ...dadosProduto,
                criador: userId
            };

            const response = CommonResponse.success(
                HttpStatusCodes.OK.message,
                produtoComCriador
            );
            await this.service.validar(produtoComCriador);
            return response.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        const dadosProduto: typeProduto = req.body;
        const userId = (req as AuthenticatedRequest).user_id;

        console.log('Cadastrando produto para usuário:', userId);
        try {
            // Adicionar o criador aos dados do produto
            const produtoComCriador = {
                ...dadosProduto,
                criador: userId
            };

            const produto = await this.service.cadastrar(produtoComCriador);
            return produto.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log('Listando produtos');
        try {
            const produtos = await this.service.listar();
            return produtos.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        console.log('Buscando produto por ID:', id);

        try {
            if(!id) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['ID do produto não fornecido']
                );
                return response.send(res);
            }

            // Validação de ObjectId com safeParse
            const objectIdValidation = objectIdSchema.safeParse(id);
            if (!objectIdValidation.success) {
                const response = CommonResponse.badRequest(
                    'ID inválido',
                    ['O ID fornecido não é um ObjectId válido']
                );
                return response.send(res);
            }

            const produto = await this.service.buscarPorId(objectIdValidation.data);
            return produto.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async editar(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        const dadosProduto: typeProdutoEdicao = req.body;
        const userId = (req as AuthenticatedRequest).user_id;

        console.log('Editando produto:', id, 'para usuário:', userId);
        try {
            if(!id) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['ID do produto não fornecido']
                );
                return response.send(res);
            }

            // Validação de ObjectId com safeParse
            const objectIdValidation = objectIdSchema.safeParse(id);
            if (!objectIdValidation.success) {
                const response = CommonResponse.badRequest(
                    'ID inválido',
                    ['O ID fornecido não é um ObjectId válido']
                );
                return response.send(res);
            }

            const produtoAtualizado = await this.service.editar(objectIdValidation.data, dadosProduto, userId);
            return produtoAtualizado.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async deletar(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params;
        const userId = (req as AuthenticatedRequest).user_id;

        console.log('Deletando produto:', id, 'para usuário:', userId);
        try {
            if(!id) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['ID do produto não fornecido']
                );
                return response.send(res);
            }

            // Validação de ObjectId com safeParse
            const objectIdValidation = objectIdSchema.safeParse(id);
            if (!objectIdValidation.success) {
                const response = CommonResponse.badRequest(
                    'ID inválido',
                    ['O ID fornecido não é um ObjectId válido']
                );
                return response.send(res);
            }

            const resultado = await this.service.deletar(objectIdValidation.data, userId);
            return resultado.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async buscarTodosProdutosUsuario(req:Request, res:Response, next:NextFunction):Promise<void> {
        const { id } = req.params || {};

        console.log('Buscando produtos por ID de Usuario', id);
        try {
            if(!id) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['ID do usuário não fornecido']
                );
                return response.send(res);
            }
            
            // Validação de ObjectId com safeParse
            const objectIdValidation = objectIdSchema.safeParse(id);
            if (!objectIdValidation.success) {
                const response = CommonResponse.badRequest(
                    'ID inválido',
                    ['O ID fornecido não é um ObjectId válido']
                );
                return response.send(res);
            }

            const produtos = await this.service.buscarTodosProdutosUsuario(req, objectIdValidation.data);
            return produtos.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }
}

export default ControllerProduto;