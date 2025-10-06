import { z } from "zod";
import RepositoryUsuario from "../repository/repositoryUsuario.js";
import { UsuarioSchema, UsuarioUpdateSchema } from "../utils/validations/usuarioSchema.js";
import { typeUsuario } from "../types/typeUsuario.js";
import { CommonResponse } from "../utils/helpers/commonResponse.js";
import { PasswordHelper } from "../utils/helpers/passwordHelper.js";
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

class ServiceUsuario {
    private repository: RepositoryUsuario
    constructor() {
        this.repository = new RepositoryUsuario
    }

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
        private async deleteImageFromCloudinary(imageUrl: string): Promise<boolean> {
            try {
                console.log("deletando imagem")
                const publicId = this.extractPublicIdFromUrl(imageUrl);
                console.log(publicId)
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

    async cadastrar(dadosUsuario: typeUsuario): Promise<CommonResponse> {
        try {
            UsuarioSchema.parse(dadosUsuario);

            // Criptografa a senha antes de salvar
            const senhaCriptografada = await PasswordHelper.hash(dadosUsuario.senha);
            dadosUsuario.senha = senhaCriptografada;

            const usuario = await this.repository.cadastrar(dadosUsuario);
            return CommonResponse.created('Usuário cadastrado com sucesso!', usuario);
        } catch (erro: any) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = erro.issues.map(err => {
                    const campo = err.path.length > 0 ? err.path.join('.') : 'campo';
                    return {
                        campo: campo,
                        mensagem: err.message
                    };
                });

                console.log('[Service] Erros de validação Zod:', mensagensErro);
                return CommonResponse.validationError('Dados inválidos para cadastro', mensagensErro);
            }

            throw erro;
        }
    }

    async listar(): Promise<CommonResponse> {
        try {
            const dados = await this.repository.listar();

            if (!dados || dados.length === 0) {
                return CommonResponse.success('Nenhum usuário encontrado', []);
            }

            return CommonResponse.success('Usuários listados com sucesso', dados);
        } catch (erro) {
            console.error('[Service] Erro ao listar usuários:', erro);
            return CommonResponse.error('Falha ao buscar usuários');
        }
    }

    async buscarPorId(id: string): Promise<CommonResponse> {
        try {
            const dados = await this.repository.buscarPorId(id);

            if (!dados) {
                return CommonResponse.notFound('Usuário não encontrado');
            }

            return CommonResponse.success('Usuário encontrado', dados);
        } catch (erro) {
            console.error('[Service] Erro ao buscar usuário por id:', erro);
            return CommonResponse.error('Falha ao buscar usuário por id');
        }
    }

    async atualizar(id: string, dadosUsuario: typeUsuario): Promise<CommonResponse> {
        try {
            const usuarioExiste:typeUsuario = await this.repository.buscarPorId(id);

            if (!usuarioExiste) {
                return CommonResponse.notFound('Usuário não encontrado');
            }

            if (Object.keys(dadosUsuario).length === 0) {
                return CommonResponse.badRequest('Nenhum dado fornecido para atualização');
            }

            // Se a senha estiver sendo atualizada, criptografe-a
            if (dadosUsuario.senha) {
                dadosUsuario.senha = await PasswordHelper.hash(dadosUsuario.senha);
            }

            UsuarioUpdateSchema.parse(dadosUsuario);
            // console.log("FotoPerfil:",dadosUsuario.fotoPerfil)
            // console.log("Banco:", dadosUsuario.fotoPerfil)
            if(dadosUsuario.fotoPerfil === null && usuarioExiste.fotoPerfil){
                // console.log("Aqui")
                await this.deleteImageFromCloudinary(usuarioExiste.fotoPerfil)
            }
            
            const usuarioAtualizado = await this.repository.atualizar(id, dadosUsuario);
            if (!usuarioAtualizado) {
                return CommonResponse.error('Falha ao atualizar usuário');
            }

            return CommonResponse.success('Usuário atualizado com sucesso', usuarioAtualizado);
        } catch (erro) {
            if (erro instanceof z.ZodError) {
                const mensagensErro = erro.issues.map(err => {
                    const campo = err.path.length > 0 ? err.path.join('.') : 'campo';
                    return {
                        campo: campo,
                        mensagem: err.message
                    };
                });

                console.log('[Service] Erros de validação na atualização:', mensagensErro);
                return CommonResponse.validationError('Dados inválidos para atualização', mensagensErro);
            }

            console.error('[Service] Erro ao atualizar usuário:', erro);
            return CommonResponse.error('Falha ao atualizar usuário');
        }
    }

    async deletar(id: string): Promise<CommonResponse> {
        try {
            // Verificar se o usuário existe
            const usuarioExiste = await this.repository.buscarPorId(id);

            if (!usuarioExiste) {
                return CommonResponse.notFound('Usuário não encontrado para deletar');
            }

            console.log(`Usuário ${usuarioExiste.nome} encontrado, prosseguindo para deletar!`);

            const resultado = await this.repository.deletar(id);
            if (!resultado) {
                return CommonResponse.error('Falha ao deletar usuário');
            }

            return CommonResponse.success('Usuário deletado com sucesso', { id, nome: usuarioExiste.nome });
        } catch (erro) {
            console.error('[Service] Erro ao deletar usuário:', erro);
            return CommonResponse.error('Falha ao deletar usuário');
        }
    }
}

export default ServiceUsuario;