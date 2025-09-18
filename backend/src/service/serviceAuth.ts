import RepositoryUsuario from "../repository/repositoryUsuario";
import tokenUtil from "../utils/tokenUtil";
import jwt from "jsonwebtoken";
import { CommonResponse } from "../utils/helpers/commonResponse";

class ServiceAuth {
    private usuarioRepository: RepositoryUsuario;
    private tokenUtil;
    
    constructor() {
        this.usuarioRepository = new RepositoryUsuario();
        this.tokenUtil = tokenUtil;
    }

    async login(email: string, senha: string): Promise<CommonResponse> {
        try {
            const usuario = await this.usuarioRepository.buscarPorEmail(email);
            if (!usuario) {
                return CommonResponse.unauthorized("Email ou senha incorretos");
            }
            
            if (usuario.senha !== senha) {
                return CommonResponse.unauthorized("Email ou senha incorretos");
            }
            
            const accessToken = await this.tokenUtil.generateAccessToken(usuario._id) as string;
            const userComTokens = await this.usuarioRepository.buscarPorId(usuario._id, true);
            let refreshToken = userComTokens.refreshToken;

            if (refreshToken) {
                try {
                    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN as string);
                } catch (error: any) {
                    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                        refreshToken = await this.tokenUtil.generateRefreshToken(usuario._id);
                    } else {
                        return CommonResponse.error('Falha na geração de token');
                    }
                }
            } else {
                // Se o refresh token não existe, gera um novo
                refreshToken = await this.tokenUtil.generateRefreshToken(usuario._id);
            }

            // Armazenar os tokens atualizados
            await this.usuarioRepository.armazenarTokens(usuario._id, accessToken, refreshToken);

            // Buscar novamente o usuário e remover a senha
            const userLogado = await this.usuarioRepository.buscarPorEmail(email);
            delete userLogado.senha;
            const userObjeto = userLogado.toObject();

            // Retornar o usuário com os tokens
            const userData = { accessToken, refreshToken, ...userObjeto };
            return CommonResponse.success('Login realizado com sucesso', userData);

        } catch (erro: any) {
            console.error('[Service] Erro no login:', erro);
            return CommonResponse.error('Erro interno no servidor durante login');
        }
    }
    async carregaToken(id: string): Promise<CommonResponse> {
        try {
            const data = await this.usuarioRepository.buscarPorId(id, true);
            
            if (!data) {
                return CommonResponse.notFound('Usuário não encontrado');
            }
            
            return CommonResponse.success('Token carregado com sucesso', data );
        } catch (erro: any) {
            console.error('[Service] Erro ao carregar token:', erro);
            return CommonResponse.error('Erro interno ao carregar token');
        }
    }

    async logout(id: string, token: string): Promise<CommonResponse> {
        try {
            // Validação do ID
            if (!id) {
                return CommonResponse.badRequest('ID do usuário é obrigatório para logout', ['ID não fornecido']);
            }

            // Validação do token
            if (!token) {
                return CommonResponse.badRequest('Token é obrigatório para logout', ['Token não fornecido']);
            }

            // Verificar se o usuário existe
            const usuario = await this.usuarioRepository.buscarPorId(id);
            if (!usuario) {
                return CommonResponse.notFound('Usuário não encontrado para logout');
            }

            const data = await this.usuarioRepository.removeToken(id);
            if (!data) {
                return CommonResponse.error('Erro ao fazer logout do usuário');
            }

            return CommonResponse.success('Logout realizado com sucesso', null);
        } catch (erro: any) {
            console.error('[Service] Erro no logout:', erro);
            return CommonResponse.error('Erro interno no servidor durante logout');
        }
    }

}
export default ServiceAuth