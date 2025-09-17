import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import ServiceAuth from '../service/serviceAuth';
import { Request, Response } from 'express';

class AuthMiddleware {
    private service: ServiceAuth
    constructor() {
        this.service = new ServiceAuth()
    }

    _getTokenAndSecret(req: Request | any) {
        const authHeader = req.headers?.authorization ?? null
        if (authHeader) {
            const parts: string = authHeader.split(' ');
            const token = parts.length === 2 ? parts[1] : parts[0]

            return {
                token,
                secret: process.env.JWT_SECRET_ACCESS_TOKEN as string
            }
        }
        throw new Error('Token não informado')
    }
    async handle(req: Request, res: Response) {
        try {
            const { token, secret } = this._getTokenAndSecret(req)
            const verifyJwt = (token: string, secret: string, callback: (err: any, decoded: any) => void) => {
                jwt.verify(token, secret, callback);
            };

            const verifyAsync = promisify(verifyJwt);

            // Uso com async/await
            const decoded = await verifyAsync(token, secret);

            if (!decoded) {
                throw new Error('Token JWT expirado, tente novamente')
            }
            if (secret === process.env.JWT_SECRET_ACCESS_TOKEN) {
                const tokenData = await this.service.carregaToken(decoded.id)
                if(!tokenData.data?.accessToken){
                    return res.status(500).json({message: "AccessToken inválido!, autentique-se novamente."})
                    throw new Error('AccessToken inválido!, autentique-se novamente.')
                }
                if (!tokenData.data?.refreshToken) {
                    // console.log(tokenData.data?.refreshToken)
                    throw new Error('RefeshToken inválido!, autentique-se novamente.')
                }
            }
            interface AuthenticatedRequest extends Request {
                user_id?: string; // ou number, dependendo do tipo de ID
            }

            // No middleware:
            const reqTyped = req as AuthenticatedRequest;
            reqTyped.user_id = decoded.id;
            return reqTyped
        } catch (erro: any) {
            if (erro.name === 'JsonWebTokenError') {
                // console.log("AQUIIIIIII")
                throw new Error('Token JWT inválido!');
            }
            if (erro.name === 'TokenExpiredError') {
                throw new Error('Token JWT expirado, faça login novamente.');
            }
            // Outros erros seguem para o errorHandler global
            throw new Error(erro)
        }
    }
}
export default new AuthMiddleware()