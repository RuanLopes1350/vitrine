import { typeLogin } from "../types/typeLogin";
import ServiceAuth from '../service/serviceAuth'
import { promisify } from "util";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";


class ControllerAuth {
    private service: ServiceAuth
    constructor() {
        this.service = new ServiceAuth()
    }
    async login(usuario: typeLogin) {
        console.log(usuario)
        const data = await this.service.login(usuario.email, usuario.senha)

        return data
    }

    logout = async (req:Request<any, any, {access_token:string}>, res:Response) => {
        try {
            // Extrai o cabeçalho Authorization
            const token = req.body?.access_token  || req.headers.authorization?.split(' ')[1];

            // Verifica se o token está presente e não é uma string inválida
            if (!token || token === 'null' || token === 'undefined') {
                throw new Error('Nenhum Token informado');
            }
            const verifyJwt = (token: string, secret: string, callback: (err: any, decoded: any) => void) => {
                jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN as string, callback);
            };

            const verifyJwtAsync = promisify(verifyJwt);
            const decoded = await verifyJwtAsync(token, process.env.JWT_SECRET_ACCESS_TOKEN as string) as { id?: string };
            // Verifica se o token decodificado contém o ID do usuário
            if (!decoded || !decoded.id) {
                throw new Error("Não autorizado");
            }

            // Encaminha o token para o serviço de logout
            const data = await this.service.logout(decoded.id, token);

            // Retorna uma resposta de sucesso
            return data
        } catch (err:any) {
            // Tratamento específico para erros de JWT
            if (err.name === 'JsonWebTokenError') {
                    throw new Error('Token de acesso inválido ou malformado.');
            }

            if (err.name === 'TokenExpiredError') {
                    throw new Error('Token de acesso expirado.');
            }

            if (err.name === 'NotBeforeError') {
                    throw new Error('Token de acesso ainda não é válido.');
            }

            // Se for um CustomError, apenas repassa
                // ...existing code...

            // Para outros erros, lança um erro genérico
                throw new Error('Erro interno durante logout.');
        }
    }

}

export default ControllerAuth