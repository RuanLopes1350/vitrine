import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Interface para estender o Request do Express com user_id
 */
interface AuthenticatedRequest extends Request {
  user_id: string;
}

/**
 * Interface para o payload do JWT
 */
interface TokenPayload extends JwtPayload {
  id: string;
}

/**
 * Middleware de autenticação JWT simples e eficiente
 * Verifica se o token JWT é válido e adiciona o user_id ao request
 */
const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // 1. Extrair o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Token não fornecido' });
      return;
    }

    // 2. Verificar formato "Bearer <token>"
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      res.status(401).json({ message: 'Formato de token inválido' });
      return;
    }

    // 3. Verificar se o JWT_SECRET existe
    const jwtSecret = process.env.JWT_SECRET_ACCESS_TOKEN;
    
    if (!jwtSecret) {
      res.status(500).json({ message: 'Erro interno do servidor' });
      return;
    }

    // 4. Verificar e decodificar o token
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    
    // 5. Verificar se o payload contém o ID do usuário
    if (!decoded.id) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }

    // 6. Adicionar user_id ao request
    (req as AuthenticatedRequest).user_id = decoded.id;
    
    // 7. Continuar para o próximo middleware/controller
    next();
    
  } catch (error) {
    // Tratar erros específicos do JWT
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expirado' });
      return;
    }
    
    if (error instanceof jwt.NotBeforeError) {
      res.status(401).json({ message: 'Token ainda não é válido' });
      return;
    }
    
    // Erro genérico
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export default authMiddleware;
export type { AuthenticatedRequest };