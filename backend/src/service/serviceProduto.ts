import { z } from "zod";
import RepositoryProduto from "../repository/repositoryProduto";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto";
import { ProdutoSchema, ProdutoEdicaoSchema } from "../utils/validations/produtoSchema";
import { CommonResponse } from "../utils/helpers/commonResponse";
import HttpStatusCodes from "../utils/helpers/httpStatusCodes";

class ServiceProduto {
    private repository: RepositoryProduto
    constructor() {
        this.repository = new RepositoryProduto()
    }

    private formatarErrosZod(erros: z.ZodError): any[] {
        return erros.issues.map(err => {
            const campo = err.path.length > 0 ? err.path.join('.') : 'campo';
            let mensagem = err.message;

            // Customizar mensagens para tipos específicos de erro
            if (err.code === 'invalid_type') {
                switch (campo) {
                    case 'nome_produto':
                        mensagem = 'Nome do produto é obrigatório e deve ser um texto!';
                        break;
                    case 'descricao':
                        mensagem = 'Descrição é obrigatória e deve ser um texto!';
                        break;
                    case 'preco':
                        mensagem = 'Preço é obrigatório e deve ser um número!';
                        break;
                    case 'ativo':
                        mensagem = 'Status ativo é obrigatório e deve ser verdadeiro ou falso!';
                        break;
                    case 'mensagem':
                        mensagem = 'Mensagem é obrigatória e deve ser um texto!';
                        break;
                    case 'criador':
                        mensagem = 'ID do criador é obrigatório!';
                        break;
                    default:
                        mensagem = `Campo ${campo} é obrigatório ou tem tipo inválido!`;
                }
            }

            return {
                campo: campo,
                mensagem: mensagem
            };
        });
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
                const mensagensErro = this.formatarErrosZod(erro);
                
                console.log('[Service] Erros de validação:', mensagensErro);
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

            // Validação com Zod para dados de edição
            ProdutoEdicaoSchema.parse(dadosProduto);

            const produtoAtualizado = await this.repository.editar(id, dadosProduto);
            if (!produtoAtualizado) {
                return CommonResponse.error('Falha ao atualizar produto');
            }

            return CommonResponse.success('Produto atualizado com sucesso', produtoAtualizado);
        } catch (erro) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = this.formatarErrosZod(erro);
                
                console.log('[Service] Erros de validação na edição:', mensagensErro);
                return CommonResponse.validationError('Dados inválidos para atualização', mensagensErro);
            }
            
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