import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import ServiceAuth from '../service/serviceAuth';
import { Request, Response, NextFunction } from 'express';
import { CommonResponse } from '../utils/helpers/commonResponse.js';

class AuthMiddleware {
    private service: ServiceAuth
    constructor() {
        this.service = new ServiceAuth()
        this.handle = this.handle.bind(this)
    }

    _getTokenAndSecret(req: Request | any, res:Response) {
        const authHeader = req.headers?.authorization ?? null
        if (authHeader) {
            const parts: string = authHeader.split(' ');
            const token = parts.length === 2 ? parts[1] : parts[0] 

            return {
                token,
                secret: process.env.JWT_SECRET_ACCESS_TOKEN as string
            }
        }
        throw new Error('Token não informado!')
    }
    
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token, secret } = this._getTokenAndSecret(req, res)
            
            // Promisifica jwt.verify diretamente com tipagem adequada
            const verifyAsync = promisify(jwt.verify) as (token: string, secret: string) => Promise<any>
            const decoded = await verifyAsync(token, secret)
            
            if (!decoded) {
                throw new Error('Token JWT expirado, tente novamente')
            }
            
            if (secret === process.env.JWT_SECRET_ACCESS_TOKEN) {
                const tokenData = await this.service.carregaToken(decoded.id)
                
                // Como agora o service retorna CommonResponse, precisamos acessar os dados corretamente
                if (tokenData.isErro() || !tokenData.getData()?.accessToken) {
                    res.status(401).json({ message: "AccessToken inválido!, autentique-se novamente." });
                    return;
                }
                
                if (!tokenData.getData()?.refreshToken) {
                    throw new Error('RefreshToken inválido!, autentique-se novamente.');
                }
            }
            
            interface AuthenticatedRequest extends Request {
                user_id?: string;
            }

            // Adiciona o user_id ao request
            const reqTyped = req as AuthenticatedRequest;
            reqTyped.user_id = decoded.id;
            
            next(); // Chama o próximo middleware/controller
        } catch (erro: any) {
            if (erro.name === 'JsonWebTokenError') {
                res.status(401).json({ message: 'Token JWT inválido!' });
                return;
            }
            if (erro.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Token JWT expirado, faça login novamente.' });
                return;
            }
            if(erro.message === "Token não informado!"){
                const response = CommonResponse.forbidden("Token não informado!")
                response.send(res)
                return;
            }
            // Outros erros seguem para o errorHandler global
            next(erro);
        }
    }
}
export default new AuthMiddleware().handle