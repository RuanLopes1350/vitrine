import { Request, Response, NextFunction } from 'express';
import { DadosLogin } from '../types/typeLogin.js';
import ServicoAuth from '../service/serviceAuth.js';
import { CommonResponse } from '../utils/helpers/commonResponse.js';

// Controller de autenticação - versão simplificada
class ControladorAuth {
  private servico: ServicoAuth;

  constructor() {
    this.servico = new ServicoAuth();
  }

  // Realiza login do usuário
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('Iniciando login');
    try {
      const dados: DadosLogin = req.body;
      console.log('Email recebido:', dados.email);
      
      // Validações simples
      if (!dados.email || !dados.senha) {
        const response = CommonResponse.badRequest('Email e senha são obrigatórios');
        response.send(res);
        return;
      }

      const resultado = await this.servico.realizarLogin(dados.email, dados.senha);
      console.log('Login realizado com sucesso');
      resultado.send(res);
      
    } catch (erro: any) {
      console.log('Erro no login:', erro.message);
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
    console.log('Logout realizado');
    // Como o token é stateless, não precisamos fazer nada no backend
    // O frontend apenas remove o token do localStorage/sessionStorage
    const response = CommonResponse.success('Logout realizado com sucesso');
    response.send(res);
  }
  async recover(req: Request, res:Response):Promise<void> {
    console.log('realizando recover')
    const resultado = await this.servico.recuperaSenha(req, res) as string
    const response = CommonResponse.success(resultado)
    response.send(res)
  }
}

export default ControladorAuth;