import { Request, Response, NextFunction } from 'express';
import { DadosLogin } from '../types/typeLogin';
import ServicoAuth from '../service/serviceAuth';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { CommonResponse } from '../utils/helpers/commonResponse';

// Controller de autenticação - versão simplificada
class ControladorAuth {
  private servico: ServicoAuth;

  constructor() {
    this.servico = new ServicoAuth();
  }

  // Realiza login do usuário
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dados: DadosLogin = req.body;
      
      // Validações simples
      if (!dados.email || !dados.senha) {
        const response = CommonResponse.badRequest('Email e senha são obrigatórios');
        response.send(res);
        return;
      }

      const resultado = await this.servico.realizarLogin(dados.email, dados.senha);
      resultado.send(res);
      
    } catch (erro: any) {
      // Erros específicos de login
      if (erro.message === 'CREDENCIAIS_INVALIDAS') {
        const response = CommonResponse.unauthorized('Email ou senha incorretos');
        response.send(res);
        return;
      }
      
      // Outros erros seguem para o errorHandler
      next(erro);
    }
  }

  // Realiza logout do usuário (opcional - apenas para limpar tokens do frontend)
  async logout(req: Request, res: Response): Promise<void> {
    // Como o token é stateless, não precisamos fazer nada no backend
    // O frontend apenas remove o token do localStorage/sessionStorage
    const response = CommonResponse.success('Logout realizado com sucesso');
    response.send(res);
  }
}

export default ControladorAuth;