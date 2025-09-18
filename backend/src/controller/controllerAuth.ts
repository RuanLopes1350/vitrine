import { Request, Response, NextFunction } from 'express';
import { typeLogin } from "../types/typeLogin";
import ServiceAuth from '../service/serviceAuth';
import { CommonResponse } from "../utils/helpers/commonResponse";
import HttpStatusCodes from "../utils/helpers/httpStatusCodes";

class ControllerAuth {
    private service: ServiceAuth;

    constructor() {
        this.service = new ServiceAuth();
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dadosLogin: typeLogin = req.body;
            
            const errosValidacao: string[] = [];
            
            if (!dadosLogin.email || dadosLogin.email.trim() === '') {
                errosValidacao.push('Email é obrigatório e não pode estar vazio');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosLogin.email)) {
                errosValidacao.push('Email deve ter um formato válido');
            }
            
            if (!dadosLogin.senha || dadosLogin.senha.trim() === '') {
                errosValidacao.push('Senha é obrigatória e não pode estar vazia');
            }

            if (errosValidacao.length > 0) {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message, 
                    errosValidacao
                );
                response.send(res);
                return;
            }

            const usuario = await this.service.login(dadosLogin.email, dadosLogin.senha);
            usuario.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Extrai o token do cabeçalho Authorization ou do body
            const token = req.body?.access_token || req.headers.authorization?.split(' ')[1];

            if (!token || token === 'null' || token === 'undefined') {
                const response = CommonResponse.badRequest(
                    HttpStatusCodes.BAD_REQUEST.message,
                    ['Token é obrigatório para logout']
                );
                response.send(res);
                return;
            }

            // Obtém o user_id do middleware de autenticação
            const userId = (req as any).user_id;
            
            if (!userId) {
                const response = CommonResponse.unauthorized('Usuário não autenticado');
                response.send(res);
                return;
            }

            const resultado = await this.service.logout(userId, token);
            resultado.send(res);
        } catch (erro: any) {
            next(erro);
        }
    }
}

export default ControllerAuth;