import RepositoryUsuario from '../repository/repositoryUsuario';
import geradorToken from '../utils/tokenUtil';
import { RespostaLogin } from '../types/typeLogin';
import { CommonResponse } from '../utils/helpers/commonResponse';
import { PasswordHelper } from '../utils/helpers/passwordHelper';

// Serviço de autenticação - versão simplificada
class ServicoAuth {
  private repositorioUsuario: RepositoryUsuario;

  constructor() {
    this.repositorioUsuario = new RepositoryUsuario();
  }

  // Realiza login e retorna dados do usuário com token
  async realizarLogin(email: string, senha: string): Promise<CommonResponse> {
    // 1. Buscar usuário por email
    const usuario = await this.repositorioUsuario.buscarPorEmailComSenha(email);
    
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
        email: usuario.email
      }
    };

    // 5. Retornar usando CommonResponse
    return CommonResponse.success('Login realizado com sucesso', dadosResposta);
  }
}

export default ServicoAuth;