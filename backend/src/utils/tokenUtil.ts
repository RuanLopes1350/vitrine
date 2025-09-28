import jwt from 'jsonwebtoken';
import { PayloadToken } from '../types/typeLogin.js';

// Utilitário para gerenciar tokens JWT de forma simples
class GeradorToken {
  
  // Gera um token de acesso JWT
  gerarToken(id: string, email: string): string {
    const payload: PayloadToken = { id, email };
    
    const segredo = process.env.JWT_SECRET_ACCESS_TOKEN;
    if (!segredo) {
      throw new Error('Segredo JWT não configurado');
    }
    
    return jwt.sign(payload, segredo, { 
      expiresIn: '24h' 
    });
  }
  
  // Verifica se um token é válido e retorna o payload
  verificarToken(token: string): PayloadToken {
    const segredo = process.env.JWT_SECRET_ACCESS_TOKEN;
    if (!segredo) {
      throw new Error('Segredo JWT não configurado');
    }
    
    return jwt.verify(token, segredo) as PayloadToken;
  }
}

export default new GeradorToken();
