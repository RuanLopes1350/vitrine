import RepositoryUsuario from '../repository/repositoryUsuario.js';
import geradorToken from '../utils/tokenUtil.js';
import { RespostaLogin } from '../types/typeLogin.js';
import { CommonResponse } from '../utils/helpers/commonResponse.js';
import { PasswordHelper } from '../utils/helpers/passwordHelper.js';
import { UsuarioUpdateSchema } from '../utils/validations/usuarioSchema.js';
import { typeUsuario } from '../types/typeUsuario.js';
import { Response, Request } from 'express';
import { enviarEmail, MailDataGenerico, SendMailParams } from '../utils/mailService.js';

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

  async recuperaSenha(req: Request, res: Response) {
    console.log(req.body)
    type usuarioMongo = typeUsuario & {
      _id: string;
      tokenUnico: string;
    }
    const validarEmail = UsuarioUpdateSchema.parse(req.body)
    const data = await this.repositorioUsuario.buscarPorEmail(validarEmail.email as string) as usuarioMongo
    if (!data || (data.ativo !== true)) {
      console.log("realizarLogin")
      const response = CommonResponse.success('Enviamos um email de para recuperar senha')
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

    // const tokenUnico = geradorToken.generatePasswordRecoveryToken(data._id);
    const expMs = Date.now() + 60 * 60 * 1000; // 1 hora de expiração
    const novosDados = await this.repositorioUsuario.atualizar(data._id, {
      codigoRecuperaSenha: codigoRecuperaSenha,
      expCodigoRecuperaSenha: new Date(expMs).toISOString() // Armazenar expiração como string ISO TMZ0 Ex.: 2023-10-01T12:00:00.000Z
    });

    if (!novosDados) {
      const response = CommonResponse.error("Erro interno do servidor!", [], 500)
      response.send(res)
      return
    }
    const emailRecuperaSenha: SendMailParams = {
      to: validarEmail.email!,
      subject: "Vitrine: Recuperação de Senha",
      template: "generico",
      data: {
        titulo: "Redefinição de Senha",
        nomeSistema: "Vitrine",
        mostrarHeader: true,
        nome: data.nome,
        subtitulo: "Siga as instruções abaixo para criar uma nova senha.",
        mensagem: `<br>Recebemos uma solicitação para redefinir a senha da sua conta. Para continuar, clique no botão abaixo. O link de redefinição é válido por <strong>60 minutos</strong>.<br><div style="width: 100%; text-align: center; margin: 20px 0;"><p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Código</p><strong style="font-size: 40px; letter-spacing: 8px;">${codigoRecuperaSenha}</strong></div>`,
        mostrarBotao: true,
        textoBotao: "Redefinir Minha Senha",
        urlBotao: "http://localhost:3000/esqueci-minha-senha-b",
        nota: "Se você não solicitou esta alteração, pode ignorar este e-mail com segurança. Nenhuma alteração será feita em sua conta.",
        textoFooter: "Esta é uma mensagem automática. Por favor, não responda a este e-mail."
      } as MailDataGenerico
    }
    try{
      const response = await enviarEmail(emailRecuperaSenha)
    console.log(`Email enviado com sucesso: ${response}`)
    console.log(`Código de recuperação de senha: ${codigoRecuperaSenha}`)
    }
    catch(erro){
      console.log(`Erro ao enviar email: ${erro}`)
    }
    // const resetUrl = `${process.env.MAIL_HOST}/auth/?token=${tokenUnico}`;
    return "Enviamos um email de para recuperar senha"


  }

  async trocaSenha(req:Request, res:Response) {
    const {codigo} = req.body
    const {senha} = req.body
    const novaSenha = await PasswordHelper.hash(senha)
    const data = await this.repositorioUsuario.trocaSenha(codigo, novaSenha)
    console.log(data)
    if(!data) {
      const response = CommonResponse.error("Nenhum codigo encontrado", ["Codigo"], 500)
      response.send(res)
    }
    return data
  }
}

export default ServicoAuth;