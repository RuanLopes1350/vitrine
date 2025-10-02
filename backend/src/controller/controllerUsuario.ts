import { Request, Response, NextFunction } from 'express';
import ServiceUsuario from "../service/serviceUsuario.js";
import { typeUsuario } from "../types/typeUsuario.js";
import { CommonResponse } from "../utils/helpers/commonResponse.js";
import HttpStatusCodes from "../utils/helpers/httpStatusCodes.js";
import objectIdSchema from '../utils/validations/objectIdSchema.js';

class ControllerUsuario {
    private service: ServiceUsuario;

    constructor() {
        this.service = new ServiceUsuario();
    }

    async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log('Cadastrando usuário');
        try {
            const dadosUsuario: typeUsuario = req.body;

            const errosValidacao: Array<{ campo: string; mensagem: string }> = [];

            if (!dadosUsuario.nome || dadosUsuario.nome.trim() === '') {
                errosValidacao.push({ campo: 'nome', mensagem: 'Nome é obrigatório e não pode estar vazio' });
            }

            if (!dadosUsuario.nomeLoja || dadosUsuario.nomeLoja.trim() === '') {
                errosValidacao.push({ campo: 'nomeLoja', mensagem: 'Nome da loja é obrigatório' });
            }

            if (!dadosUsuario.whatsapp || dadosUsuario.whatsapp.trim() === '') {
                errosValidacao.push({ campo: 'whatsapp', mensagem: 'WhatsApp é obrigatório' });
            }

            if (!dadosUsuario.email || dadosUsuario.email.trim() === '') {
                errosValidacao.push({ campo: 'email', mensagem: 'Email é obrigatório' });
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosUsuario.email)) {
                errosValidacao.push({ campo: 'email', mensagem: 'Email deve ter um formato válido' });
            }

            if (!dadosUsuario.senha || dadosUsuario.senha.trim() === '') {
                errosValidacao.push({ campo: 'senha', mensagem: 'Senha é obrigatória' });
            } else if (dadosUsuario.senha.length < 8) {
                errosValidacao.push({
                    campo: 'senha',
                    mensagem: 'A senha deve conter pelo menos 8 caracteres'
                });
            }

            // VALIDAÇÃO DE SENHA ADICIONADA
            if (!dadosUsuario.senha || dadosUsuario.senha.trim() === '') {
                errosValidacao.push({ campo: 'senha', mensagem: 'Senha é obrigatória' });
            } else if (dadosUsuario.senha.length < 6) {
                errosValidacao.push({ campo: 'senha', mensagem: 'A senha deve ter no mínimo 6 caracteres' });
            }

            if (errosValidacao.length > 0) {
                const response = CommonResponse.validationError(
                    'Dados inválidos para cadastro',
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
        console.log('Listando usuários');
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
            const objectIdValidation = objectIdSchema.safeParse(id);
            if (!objectIdValidation.success) {
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
            const objectIdValidation = objectIdSchema.safeParse(id);
            if (!objectIdValidation.success) {
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
            const objectIdValidation = objectIdSchema.safeParse(id);
            if (!objectIdValidation.success) {
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