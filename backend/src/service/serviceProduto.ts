import RepositoryProduto from "../repository/repositoryProduto";
import { typeProduto } from "../types/typeProduto";

class ServiceProduto {
    private repository: RepositoryProduto
    constructor() {
        this.repository = new RepositoryProduto()
    }

    async cadastrar(dadosProduto: typeProduto) {
        try {
            // TODO: Implementar regras de negócios.
            // Exemplo: validar se email já existe
            const produto = await this.repository.cadastrar(dadosProduto)
            return produto;
        } catch (erro) {
            console.error('[Service] Erro ao cadastrar produto:', erro);
            throw new Error('Falha ao cadastrar produto');
        }
    }

    async listar() {
        try {
            const dados = await this.repository.listar()
            return dados;
        } catch (erro) {
            console.error('[Service] Erro ao listar produtos:', erro);
            throw new Error('Falha ao buscar produtos');
        }
    }

    async buscarPorId(id:string) {
        try {
            const dados = await this.repository.buscarPorId(id)
            return dados;
        } catch (erro) {
            console.error('[Service] Erro ao buscar produto por id:', erro);
            throw new Error('Falha ao buscar produto por id')
        }
    }

    async deletar(id:string) {
        try {
            const produtoExiste:typeProduto = await this.buscarPorId(id)

            if(produtoExiste) {
                console.log(`Produto ${produtoExiste.nome_produto} encontrado, prosseguindo para deletar!`)
                return await this.repository.deletar(id)
            }
            throw new Error('Produto não encontrado para deletar!');
        } catch (erro) {
            console.error('[Service] Erro ao deletar usuário:', erro);
            throw new Error('Falha ao deletar usuário');
        }
    }
}

export default ServiceProduto;