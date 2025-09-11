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
        } catch (erro) {
            console.error('[Service] Erro ao cadastrar usuário:', erro);
            throw new Error('Falha ao cadastrar usuário!');
        }
    }

    async listar() {
        try {
            const dados = await this.repository.listar()
            return dados;
        } catch (erro) {
            console.error('[Service] Erro no ao listar usuários:', erro);
            throw new Error('Falha ao buscar usuários');
        }
    }

    async buscarPorId(id: string) {
        try {
            const dados = await this.repository.buscarPorId(id);
            if (!dados) {
                throw new Error('Usuário não encontrado!');
            }
            return dados;
        } catch (erro) {
            console.error('[Service] Erro ao buscar usuário por id:', erro)
            if (erro.message === 'Usuário não encontrado!') {
                throw erro;
            }
            
            throw new Error('Falha ao buscar usuário!')
        }
    }

    async atualizar(id: string, dadosUsuario: typeUsuario) {
        try {
            const usuarioExiste:typeUsuario = await this.repository.buscarPorId(id);

            if(usuarioExiste) {
                console.log(`Usuário ${usuarioExiste.nome} encontrado, prosseguindo para atualizar!`)
                return await this.repository.atualizar(id, dadosUsuario);
            }
            throw new Error('Usuário não encontrado para atualizar!');
        } catch (erro) {
            console.error('[Service] Erro ao atualizar usuário:', erro);
            throw new Error('Falha ao atualizar usuário');
        }
    }

    async deletar(id: string) {
        try {
            const usuarioExiste:typeUsuario = await this.repository.buscarPorId(id)
            
            if(usuarioExiste) {
                console.log(`Usuário ${usuarioExiste.nome} encontrado, prosseguindo para deletar!`)
                return await this.repository.deletar(id);
            }
            throw new Error('Usuário não encontrado para deletar!');
            
        } catch (erro) {
            console.error('[Service] Erro ao deletar usuário:', erro);
            throw new Error('Falha ao deletar usuário');
        }
    }
}

export default ServiceUsuario;