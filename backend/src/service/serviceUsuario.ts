import { z } from "zod";
import RepositoryUsuario from "../repository/repositoryUsuario";
import { UsuarioSchema, UsuarioUpdateSchema } from "../utils/validations/usuarioSchema.ts";
import { typeUsuario } from "../types/typeUsuario";
import { CommonResponse } from "../utils/helpers/commonResponse";
import { PasswordHelper } from "../utils/helpers/passwordHelper";

class ServiceUsuario {
    private repository: RepositoryUsuario
    constructor() {
        this.repository = new RepositoryUsuario
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
            const usuarioExiste = await this.repository.buscarPorId(id);

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