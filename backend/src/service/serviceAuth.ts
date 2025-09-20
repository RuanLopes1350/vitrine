import RepositoryUsuario from '../repository/repositoryUsuario';
import geradorToken from '../utils/tokenUtil';
import { RespostaLogin } from '../types/typeLogin';

/**
 * Serviço de autenticação - versão simplificada
 */
class ServicoAuth {
  private repositorioUsuario: RepositoryUsuario;

  constructor() {
    this.repositorioUsuario = new RepositoryUsuario();
  }

  /**
   * Realiza login e retorna dados do usuário com token
   */
  async realizarLogin(email: string, senha: string): Promise<RespostaLogin> {
    // 1. Buscar usuário por email
    const usuario = await this.repositorioUsuario.buscarPorEmail(email);
    
    if (!usuario) {
      throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // 2. Verificar senha (em produção, use bcrypt para hash)
    if (usuario.senha !== senha) {
      throw new Error('CREDENCIAIS_INVALIDAS');
    }

    // 3. Gerar token JWT
    const token = geradorToken.gerarToken(usuario._id.toString(), usuario.email);

    // 4. Retornar dados do usuário sem a senha
    return {
      token,
      usuario: {
        id: usuario._id.toString(),
        nome: usuario.nome,
        email: usuario.email
      }
    };
  }
}

export default ServicoAuth;