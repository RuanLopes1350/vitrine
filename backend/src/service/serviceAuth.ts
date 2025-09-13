import RepositoryUsuario from "../repository/repositoryUsuario";
import tokenUtil from "../utils/tokenUtil";
import  jwt  from "jsonwebtoken";

class ServiceAuth {
    private usuarioRepository: RepositoryUsuario
    private tokenUtil
    constructor() {
        this.usuarioRepository = new RepositoryUsuario()
        this.tokenUtil = tokenUtil
    }

    async login(email: string, senha: string) {
        try {
            const usuario = await this.usuarioRepository.buscarPorEmail(email)
            if (!usuario) {
                throw new Error("Senha ou Email incorretos")
            }
            if (usuario.senha !== senha) {
                throw new Error("Senha ou Email incorretos")
            }
            const accessToken = await this.tokenUtil.generateAccessToken(usuario._id) as string
            const userComTokens = await this.usuarioRepository.buscarPorId(usuario._id, true);
            let refreshToken = userComTokens.refreshToken;

            if (refreshToken) {
                try {
                    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN as string);
                } catch (error: any) {
                    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                        refreshToken = await this.tokenUtil.generateRefreshToken(usuario._id);
                    } else {
                        throw new Error('Falha na geração de token');
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
            return { user: { accessToken, refreshToken, ...userObjeto } };


        } catch (erro: any) {
            console.log(erro, 'Deu ruim aqui')
            throw new Error(erro.message)

        }
    }
    async carregaToken(id: string) {
        const data = await this.usuarioRepository.buscarPorId(id, true)
        return { data }

    }
}
export default ServiceAuth