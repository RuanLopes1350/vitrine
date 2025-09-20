import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CommonResponse } from '../utils/helpers/commonResponse';

// Regex para validar ObjectId do MongoDB
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

// Interface para estender o Request do Express com user_id
interface AuthenticatedRequest extends Request {
  user_id: string;
}

// Interface para o payload do JWT
interface TokenPayload extends JwtPayload {
  id: string;
}

// Middleware de autenticação JWT simples e eficiente
// Verifica se o token JWT é válido e adiciona o user_id ao request
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Extrair o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      const response = CommonResponse.unauthorized('Token não fornecido');
      response.send(res);
      return;
    }

    // 2. Verificar formato "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      const response = CommonResponse.unauthorized('Formato de token inválido');
      response.send(res);
      return;
    }

    // 3. Verificar se o JWT_SECRET existe
    const jwtSecret = process.env.JWT_SECRET_ACCESS_TOKEN;
    
    if (!jwtSecret) {
      const response = CommonResponse.error('Erro interno do servidor');
      response.send(res);
      return;
    }

    // 4. Verificar e decodificar o token
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    
    // 5. Verificar se o payload contém o ID do usuário
    if (!decoded.id) {
      const response = CommonResponse.unauthorized('Token inválido');
      response.send(res);
      return;
    }

    // 6. Verificar se o ID do usuário é um ObjectId válido
    if (!objectIdRegex.test(decoded.id)) {
      const response = CommonResponse.unauthorized('ID de usuário inválido no token');
      response.send(res);
      return;
    }

    // 7. Adicionar user_id ao request
    (req as AuthenticatedRequest).user_id = decoded.id;
    
    // 8. Continuar para o próximo middleware/controller
    next();
    
  } catch (error) {
    // Tratar erros específicos do JWT
    if (error instanceof jwt.JsonWebTokenError) {
      const response = CommonResponse.unauthorized('Token inválido');
      response.send(res);
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      const response = CommonResponse.unauthorized('Token expirado');
      response.send(res);
      return;
    }
    
    if (error instanceof jwt.NotBeforeError) {
      const response = CommonResponse.unauthorized('Token ainda não é válido');
      response.send(res);
      return;
    }
    
    // Erro genérico
    const response = CommonResponse.error('Erro interno do servidor');
    response.send(res);
  }
};

export default authMiddleware;
export type { AuthenticatedRequest };