import { z } from "zod";
import { v2 as cloudinary } from 'cloudinary';
import RepositoryProduto from "../repository/repositoryProduto.js";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto.js";
import { ProdutoSchema, ProdutoUpdateSchema } from "../utils/validations/produtoSchema.js";
import { Query } from "../types/typeQuery.js";
import { CommonResponse } from "../utils/helpers/commonResponse.js";
import { Request } from "express";

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

class ServiceProduto {
    private repository: RepositoryProduto

    constructor() {
        this.repository = new RepositoryProduto()
    }

    // Helper para extrair ID do criador (objeto ou string)
    private getCriadorId(criador: any): string {
        if (typeof criador === 'string') {
            return criador;
        }
        if (criador && typeof criador === 'object' && criador._id) {
            return criador._id.toString();
        }
        return '';
    }

    // Helper para extrair public_id da URL do Cloudinary
    private extractPublicIdFromUrl(imageUrl: string): string | null {
        try {
            if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
                return null; // Não é uma URL do Cloudinary
            }

            // URL exemplo: https://res.cloudinary.com/dkpxwccpg/image/upload/v1759265878/Vitrine/v9qmxhkupohplcz2wqem.png
            // public_id seria: Vitrine/v9qmxhkupohplcz2wqem

            const parts = imageUrl.split('/');
            const uploadIndex = parts.findIndex(part => part === 'upload');

            if (uploadIndex === -1 || uploadIndex + 2 >= parts.length) {
                return null;
            }

            // Pega tudo após /upload/v{version}/
            const pathAfterVersion = parts.slice(uploadIndex + 2).join('/');

            // Remove a extensão do arquivo
            const publicId = pathAfterVersion.replace(/\.[^/.]+$/, '');

            return publicId;
        } catch (error) {
            console.error('Erro ao extrair public_id da URL:', error);
            return null;
        }
    }

    // Função para deletar imagem do Cloudinary
    private async deleteImageFromCloudinary(imageUrl: string): Promise<boolean> {
        try {
            const publicId = this.extractPublicIdFromUrl(imageUrl);

            if (!publicId) {
                console.log('URL não é do Cloudinary ou public_id não encontrado:', imageUrl);
                return true; // Não é erro, apenas não precisa deletar
            }

            console.log('Deletando imagem do Cloudinary com public_id:', publicId);

            const result = await cloudinary.uploader.destroy(publicId);

            if (result.result === 'ok' || result.result === 'not found') {
                console.log('Imagem deletada com sucesso ou não encontrada:', result);
                return true;
            } else {
                console.error('Falha ao deletar imagem do Cloudinary:', result);
                return false;
            }
        } catch (error) {
            console.error('Erro ao deletar imagem do Cloudinary:', error);
            return false; // Não bloqueia a operação, apenas loga o erro
        }
    }

    async validar(dadosProduto: typeProduto): Promise<CommonResponse> {
        try {
            // Apenas validação com Zod, sem salvar no banco
            ProdutoSchema.parse(dadosProduto);

            return CommonResponse.success('Dados válidos para cadastro');
        } catch (erro) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = erro.issues.map(err => {
                    const campo = err.path.length > 0 ? err.path.join('.') : 'campo';
                    return {
                        campo: campo,
                        mensagem: err.message
                    };
                });

                console.log('[Service] Erros de validação:', mensagensErro);
                return CommonResponse.validationError('Dados inválidos para cadastro', mensagensErro);
            }

            console.error('[Service] Erro ao validar produto:', erro);
            return CommonResponse.error('Falha interna ao validar produto');
        }
    }

    async cadastrar(dadosProduto: typeProduto): Promise<CommonResponse> {
        try {
            // Validação com Zod
            ProdutoSchema.parse(dadosProduto);

            // Cadastrar produto
            const produto = await this.repository.cadastrar(dadosProduto);

            return CommonResponse.created('Produto cadastrado com sucesso!', produto);
        } catch (erro: any) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = erro.issues.map(err => {
                    const campo = err.path.length > 0 ? err.path.join('.') : 'campo';
                    return {
                        campo: campo,
                        mensagem: err.message
                    };
                });

                console.log('[Service] Erros de validação:', mensagensErro);
                return CommonResponse.validationError('Dados inválidos para cadastro', mensagensErro);
            }

            throw erro;
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

    async editar(id: string, dadosProduto: typeProdutoEdicao, userId: string): Promise<CommonResponse> {
        try {
            // Verificar se o produto existe antes de editar
            const buscaResult = await this.repository.buscarPorId(id);
            if (!buscaResult) {
                return CommonResponse.notFound('Produto não encontrado');
            }

            // Verificar se o produto pertence ao usuário (com helper)
            const criadorId = this.getCriadorId(buscaResult.criador);
            if (criadorId !== userId) {
                return CommonResponse.forbidden('Você não tem permissão para editar este produto');
            }

            // Validar se pelo menos um campo foi enviado para atualização
            if (Object.keys(dadosProduto).length === 0) {
                return CommonResponse.badRequest('Nenhum dado fornecido para atualização');
            }

            // Validação com Zod para dados de edição
            ProdutoUpdateSchema.parse(dadosProduto);

            // Se uma nova imagem está sendo enviada, deletar a anterior
            if (dadosProduto.imagem && buscaResult.imagem && dadosProduto.imagem !== buscaResult.imagem) {
                console.log('Nova imagem detectada, deletando imagem anterior...');
                await this.deleteImageFromCloudinary(buscaResult.imagem);
            }

            const produtoAtualizado = await this.repository.editar(id, dadosProduto);
            if (!produtoAtualizado) {
                return CommonResponse.error('Falha ao atualizar produto');
            }

            return CommonResponse.success('Produto atualizado com sucesso', produtoAtualizado);
        } catch (erro) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = erro.issues.map(err => {
                    const campo = err.path.length > 0 ? err.path.join('.') : 'campo';
                    return {
                        campo: campo,
                        mensagem: err.message
                    };
                });

                console.log('[Service] Erros de validação na edição:', mensagensErro);
                return CommonResponse.validationError('Dados inválidos para atualização', mensagensErro);
            }

            console.error('[Service] Falha ao editar os dados de produto!', erro);
            return CommonResponse.error('Falha ao editar dados de produto');
        }
    }

    async deletar(id: string, userId: string): Promise<CommonResponse> {
        try {
            // Verificar se o produto existe
            const produtoExiste = await this.repository.buscarPorId(id);

            if (!produtoExiste) {
                return CommonResponse.notFound('Produto não encontrado para deletar');
            }

            // Verificar se o produto pertence ao usuário (com helper)
            const criadorId = this.getCriadorId(produtoExiste.criador);
            if (criadorId !== userId) {
                return CommonResponse.forbidden('Você não tem permissão para deletar este produto');
            }

            console.log(`Produto ${produtoExiste.nome_produto} encontrado, prosseguindo para deletar!`);

            // Deletar imagem da Cloudinary antes de deletar do banco
            if (produtoExiste.imagem) {
                console.log('Deletando imagem da Cloudinary...');
                await this.deleteImageFromCloudinary(produtoExiste.imagem);
            }

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
    async buscarTodosProdutosUsuario(req: Request<any, any, Query>, id:string){
        try{
            const produtosUsuario = await this.repository.buscarTodosProdutosUsuario(req, id);
            if(!produtosUsuario){
                return CommonResponse.notFound("Nenhum produto encontrado")
            }
            return CommonResponse.success("Produtos encontrados com sucesso!", produtosUsuario)
        }catch(erro){
            console.error("[Service] Falha ao buscar produtos do usuário:", erro)
            return CommonResponse.error(`Falha ao buscar produtos do usuario: ${id}`)
        }
    }
}

export default ServiceProduto;