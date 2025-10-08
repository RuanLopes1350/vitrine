import RepositoryUsuario from '../repository/repositoryUsuario.js';
import geradorToken from '../utils/tokenUtil.js';
import { RespostaLogin } from '../types/typeLogin.js';
import { CommonResponse } from '../utils/helpers/commonResponse.js';
import { PasswordHelper } from '../utils/helpers/passwordHelper.js';
import { UsuarioUpdateSchema } from '../utils/validations/usuarioSchema.js';
import { typeUsuario } from '../types/typeUsuario.js';
import { Response } from 'express';

// Serviço de autenticação - versão simplificada
class ServicoAuth {
  private repositorioUsuario: RepositoryUsuario;

  constructor() {
    this.repositorioUsuario = new RepositoryUsuario();
  }

  // Realiza login e retorna dados do usuário com token
  async realizarLogin(email: string, senha: string): Promise<CommonResponse> {
    // 1. Buscar usuário por email
    const usuario = await this.repositorioUsuario.buscarPorEmail(email);

    if (!usuario) {
      throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // 2. Verificar senha usando bcrypt.compare
    const senhaValida = await PasswordHelper.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // 3. Gerar token JWT
    const token = geradorToken.gerarToken(usuario._id.toString(), usuario.email);

    // 4. Preparar dados de resposta
    const dadosResposta: RespostaLogin = {
      token,
      usuario: {
        id: usuario._id.toString(),
        nome: usuario.nome,
        email: usuario.email,
        nomeLoja: usuario.nomeLoja,
        whatsapp: usuario.whatsapp,
        ativo: usuario.ativo,
        mensagem: usuario.mensagem,
        fotoPerfil: usuario.fotoPerfil

      }
    };

    // 5. Retornar usando CommonResponse
    return CommonResponse.success('Login realizado com sucesso', dadosResposta);
  }

  async recuperaSenha(email: string, res: Response) {
    type usuarioMongo = typeUsuario & {
      _id: string;
      tokenUnico: string;
    }
    const validarEmail = UsuarioUpdateSchema.parse(email)
    const data = await this.repositorioUsuario.buscarPorEmail(email) as usuarioMongo
    if (!data || (data.ativo !== true)) {
      const response = CommonResponse.success('Um código de recuperação foi enviado para o seu email')
      response.send(res)
      return
    }
    const generateCode = () => Math.random()
      .toString(36)              // ex: “0.f5g9hk3j”
      .replace(/[^a-z0-9]/gi, '') // mantém só letras/números
      .slice(0, 4)               // pega os 4 primeiros
      .toUpperCase();            // converte p/ maiúsculas

    let codigoRecuperaSenha = generateCode();

    let codigoExistente = await this.repositorioUsuario.buscarPorCodigoRecuperacao(codigoRecuperaSenha);

    while (codigoExistente) {
      codigoRecuperaSenha = generateCode()
      codigoExistente = await this.repositorioUsuario.buscarPorCodigoRecuperacao(codigoRecuperaSenha);
    }

    const tokenUnico = geradorToken.generatePasswordRecoveryToken(data._id);
    const expMs = Date.now() + 60 * 60 * 1000; // 1 hora de expiração
    const novosDados = await this.repositorioUsuario.atualizar(data._id, {
      tokenUnico: tokenUnico,
      codigoRecuperaSenha: codigoRecuperaSenha,
      expCodigoRecuperaSenha: new Date(expMs).toISOString() // Armazenar expiração como string ISO TMZ0 Ex.: 2023-10-01T12:00:00.000Z
    });

    if (!novosDados) {
      const response = CommonResponse.error("Erro interno do servidor!", [], 500)
      response.send(res)
      return
    }
    const resetUrl = `${process.env.MAIL_HOST}/auth/?token=${tokenUnico}`;
    const emailData = {
      to: data.email,
      subject: 'Redefinir senha',
      template: 'password-reset',
      data: {
        name: data.nome,
        resetUrl: resetUrl,
        expirationMinutes: 60, // Expiração em minutos
        year: new Date().getFullYear(),
        company: process.env.COMPANY_NAME || 'Auth'
      }
    };


  }
}

export default ServicoAuth;