import RepositoryUsuario from "../repository/repositoryUsuario";
import { typeUsuario } from "../types/typeUsuario";

class ServiceUsuario {
    private repository: RepositoryUsuario
    constructor() {
        this.repository = new RepositoryUsuario
    }

    async cadastrar(dadosUsuario: typeUsuario) {
        try {
            // TODO: Implementar regras de negócios.
            // Exemplo: validar se email já existe
            const usuario = await this.repository.cadastrar(dadosUsuario)
            return usuario;
        } catch (error) {
            console.error('[Service] Erro ao cadastrar usuário:', error);
            throw new Error('Falha ao cadastrar usuário');
        }
    }

    async listar() {
        try {
            const dados = await this.repository.listar()
            return dados;
        } catch (error) {
            console.error('[Service] Erro no ao listar usuários:', error);
            throw new Error('Falha ao buscar usuários');
        }
    }
}

export default ServiceUsuario;