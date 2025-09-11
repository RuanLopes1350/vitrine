import { z } from "zod";
import RepositoryProduto from "../repository/repositoryProduto";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto";
import { ProdutoSchema } from "../utils/validations/produtoSchema";

class ServiceProduto {
    private repository: RepositoryProduto
    constructor() {
        this.repository = new RepositoryProduto()
    }

    async cadastrar(dadosProduto: typeProduto) {
        try {
            ProdutoSchema.parse(dadosProduto);
            const produto = await this.repository.cadastrar(dadosProduto);
            return produto;
        } catch (erro) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = erro.issues.map(err =>
                    `${err.path.join('.')}: ${err.message}`
                ).join('; ');
                throw new Error(`Dados inválidos: ${mensagensErro}`);
            }

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

    async buscarPorId(id: string) {
        try {
            const dados = await this.repository.buscarPorId(id)
            return dados;
        } catch (erro) {
            console.error('[Service] Erro ao buscar produto por id:', erro);
            throw new Error('Falha ao buscar produto por id')
        }
    }

    async editar(id: string, dadosProduto: typeProdutoEdicao) {
        try {
            // Verificar se o produto existe antes de editar
            const produtoExistente = await this.repository.buscarPorId(id);
            if (!produtoExistente) {
                throw new Error('Produto não encontrado');
            }

            // Validar se pelo menos um campo foi enviado para atualização
            if (Object.keys(dadosProduto).length === 0) {
                throw new Error('Nenhum dado fornecido para atualização');
            }

            const produtoAtualizado = await this.repository.editar(id, dadosProduto);
            if (!produtoAtualizado) {
                throw new Error('Falha ao atualizar produto');
            }

            return produtoAtualizado;
        } catch (erro) {
            console.error('[Service] Falha ao editar os dados de produto!', erro);
            throw erro instanceof Error ? erro : new Error('Falha ao editar dados de produto!');
        }
    }

    async deletar(id: string) {
        try {
            const produtoExiste: typeProduto = await this.buscarPorId(id)

            if (produtoExiste) {
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