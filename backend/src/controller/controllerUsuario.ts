import { Request, Response, NextFunction } from 'express';
import ServiceUsuario from "../service/serviceUsuario";
import { typeUsuario } from "../types/typeUsuario";
import { CommonResponse } from "../utils/helpers/commonResponse";
import HttpStatusCodes from "../utils/helpers/httpStatusCodes";

// Regex para validar ObjectId do MongoDB
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

class ControllerUsuario {
    private service: ServiceUsuario;

    constructor() {
        this.service = new ServiceUsuario();
    }

    async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dadosUsuario: typeUsuario = req.body;
            
            const errosValidacao: string[] = [];
            
            if (!dadosUsuario.nome || dadosUsuario.nome.trim() === '') {
                errosValidacao.push('Nome é obrigatório e não pode estar vazio');
            }
            
            if (!dadosUsuario.email || dadosUsuario.email.trim() === '') {
                errosValidacao.push('Email é obrigatório e não pode estar vazio');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosUsuario.email)) {
                errosValidacao.push('Email deve ter um formato válido');
            }

            if (errosValidacao.length > 0) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message, 
                    errosValidacao
                );
                response.send(res);
                return;
            }

            const usuario = await this.service.cadastrar(dadosUsuario);
            usuario.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const usuarios = await this.service.listar();
            usuarios.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            
            if (!id) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['ID é obrigatório']
                );
                response.send(res);
                return;
            }

            // Validação de ObjectId
            if (!objectIdRegex.test(id)) {
                const response = CommonResponse.badRequest(
                    'ID inválido',
                    ['O ID fornecido não é um ObjectId válido']
                );
                response.send(res);
                return;
            }

            const usuario = await this.service.buscarPorId(id);
            usuario.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const dadosUsuario: typeUsuario = req.body;
            
            if (!id) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['ID é obrigatório']
                );
                response.send(res);
                return;
            }

            // Validação de ObjectId
            if (!objectIdRegex.test(id)) {
                const response = CommonResponse.badRequest(
                    'ID inválido',
                    ['O ID fornecido não é um ObjectId válido']
                );
                response.send(res);
                return;
            }

            const usuarioAtualizado = await this.service.atualizar(id, dadosUsuario);
            usuarioAtualizado.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async deletar(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            
            if (!id) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['ID é obrigatório']
                );
                response.send(res);
                return;
            }

            // Validação de ObjectId
            if (!objectIdRegex.test(id)) {
                const response = CommonResponse.badRequest(
                    'ID inválido',
                    ['O ID fornecido não é um ObjectId válido']
                );
                response.send(res);
                return;
            }

            const resultado = await this.service.deletar(id);
            resultado.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }
}

export default ControllerUsuario;