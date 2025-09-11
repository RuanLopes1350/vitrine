import { z } from "zod";
import RepositoryProduto from "../repository/repositoryProduto";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto";
import { ProdutoSchema } from "../utils/validations/produtoSchema";
import { CommonResponse } from "../utils/helpers/commonResponse";
import HttpStatusCodes from "../utils/helpers/httpStatusCodes";

class ServiceProduto {
    private repository: RepositoryProduto
    constructor() {
        this.repository = new RepositoryProduto()
    }

    async cadastrar(dadosProduto: typeProduto): Promise<CommonResponse> {
        try {
            // Validação com Zod
            ProdutoSchema.parse(dadosProduto);

            // Cadastrar produto
            const produto = await this.repository.cadastrar(dadosProduto);

            return CommonResponse.created('Produto cadastrado com sucesso!', produto);
        } catch (erro) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = erro.issues.map(err =>
                    `${err.path.join('.')}: ${err.message}`
                );
                return CommonResponse.validationError('Dados inválidos para cadastro', mensagensErro);
            }

            console.error('[Service] Erro ao cadastrar produto:', erro);
            return CommonResponse.error('Falha interna ao cadastrar produto');
        }
    }

    async listar(): Promise<CommonResponse> {
        try {
            const dados = await this.repository.listar();

            if (!dados || dados.length === 0) {
                return CommonResponse.success('Nenhum produto encontrado', []);
            }

            return CommonResponse.success('Produtos listados com sucesso', dados);
        } catch (erro) {
            console.error('[Service] Erro ao listar produtos:', erro);
            return CommonResponse.error('Falha ao buscar produtos');
        }
    }

    async buscarPorId(id: string): Promise<CommonResponse> {
        try {
            const dados = await this.repository.buscarPorId(id);

            if (!dados) {
                return CommonResponse.notFound('Produto não encontrado');
            }

            return CommonResponse.success('Produto encontrado', dados);
        } catch (erro) {
            console.error('[Service] Erro ao buscar produto por id:', erro);
            return CommonResponse.error('Falha ao buscar produto por id');
        }
    }

    async editar(id: string, dadosProduto: typeProdutoEdicao): Promise<CommonResponse> {
        try {
            // Verificar se o produto existe antes de editar
            const buscaResult = await this.repository.buscarPorId(id);
            if (!buscaResult) {
                return CommonResponse.notFound('Produto não encontrado');
            }

            // Validar se pelo menos um campo foi enviado para atualização
            if (Object.keys(dadosProduto).length === 0) {
                return CommonResponse.badRequest('Nenhum dado fornecido para atualização');
            }

            const produtoAtualizado = await this.repository.editar(id, dadosProduto);
            if (!produtoAtualizado) {
                return CommonResponse.error('Falha ao atualizar produto');
            }

            return CommonResponse.success('Produto atualizado com sucesso', produtoAtualizado);
        } catch (erro) {
            console.error('[Service] Falha ao editar os dados de produto!', erro);
            return CommonResponse.error('Falha ao editar dados de produto');
        }
    }

    async deletar(id: string): Promise<CommonResponse> {
        try {
            // Verificar se o produto existe
            const produtoExiste = await this.repository.buscarPorId(id);

            if (!produtoExiste) {
                return CommonResponse.notFound('Produto não encontrado para deletar');
            }

            console.log(`Produto ${produtoExiste.nome_produto} encontrado, prosseguindo para deletar!`);

            const resultado = await this.repository.deletar(id);
            if (!resultado) {
                return CommonResponse.error('Falha ao deletar produto');
            }

            return CommonResponse.success('Produto deletado com sucesso', { id, nome: produtoExiste.nome_produto });
        } catch (erro) {
            console.error('[Service] Erro ao deletar produto:', erro);
            return CommonResponse.error('Falha ao deletar produto');
        }
    }
}

export default ServiceProduto;