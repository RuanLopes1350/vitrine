import { Request, Response, NextFunction } from 'express';
import { DadosLogin } from '../types/typeLogin';
import ServicoAuth from '../service/serviceAuth';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

/**
 * Controller de autenticação - versão simplificada
 */
class ControladorAuth {
  private servico: ServicoAuth;

  constructor() {
    this.servico = new ServicoAuth();
  }

  /**
   * Realiza login do usuário
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados: DadosLogin = req.body;
      
      // Validações simples
      if (!dados.email || !dados.senha) {
        res.status(400).json({ 
          erro: 'Email e senha são obrigatórios' 
        });
        return;
      }

      const resultado = await this.servico.realizarLogin(dados.email, dados.senha);
      
      res.status(200).json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        dados: resultado
      });
      
    } catch (erro: any) {
      // Erros específicos de login
      if (erro.message === 'CREDENCIAIS_INVALIDAS') {
        res.status(401).json({ 
          erro: 'Email ou senha incorretos' 
        });
        return;
      }
      
      // Outros erros seguem para o errorHandler
      next(erro);
    }
  }

  /**
   * Realiza logout do usuário (opcional - apenas para limpar tokens do frontend)
   */
  async logout(req: Request, res: Response): Promise<void> {
    // Como o token é stateless, não precisamos fazer nada no backend
    // O frontend apenas remove o token do localStorage/sessionStorage
    res.status(200).json({
      sucesso: true,
      mensagem: 'Logout realizado com sucesso'
    });
  }
}

export default ControladorAuth;