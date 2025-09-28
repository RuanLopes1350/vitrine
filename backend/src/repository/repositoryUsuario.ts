import mongoose from "mongoose";
import { typeUsuario } from '../types/typeUsuario';
import modelUsuario from '../models/modelUsuario';
import { error } from "console";

class RepositoryUsuario {
    private model: mongoose.Model<any>;

    constructor(model = modelUsuario) {
        this.model = model;
    }

    async cadastrar(dadosUsuario: typeUsuario): Promise<any> {
        const usuario = new this.model(dadosUsuario);
        return await usuario.save();
    }

    async listar() {
        const dados = await this.model.find();
        return dados;
    }

    async buscarPorId(id: string, includeTokens = false) {
        let query = this.model.findById(id)
        if (includeTokens) {
            query.select('+refreshToken +accessToken')
        }
        const user = await query
        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        return user;
    }

    async atualizar(id: string, dadosUsuario: typeUsuario) {
        return await this.model.findByIdAndUpdate(id, dadosUsuario, { new: true });
    }

    async deletar(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    /**
     * Busca um usuário por email, incluindo o campo 'senha' no resultado.
     * Necessário para o processo de autenticação.
     * @param email - O email do usuário a ser buscado.
     * @returns O documento do usuário, incluindo o hash da senha, ou null se não for encontrado.
     */
    async buscarPorEmailComSenha(email: string): Promise<any> {
        const data = await this.model.findOne({ email: email }).select('+senha');
        return data;
    }

    async armazenarTokens(id: string, accesstoken: string, refreshtoken: string) {
        const documento = await this.model.findById(id);
        if (!documento) {
            throw new Error('Nenhum documento encontrado');
        }
        documento.accessToken = accesstoken;
        documento.refreshToken = refreshtoken;
        const data = await documento.save();
        return data;
    }

    async removeToken(id: string) {
        const parsedData = {
            accessToken: null,
            refreshToken: null
        };
        const usuario = await this.model.findByIdAndUpdate(id, parsedData, { new: true }).exec();

        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    }


}

export default RepositoryUsuario;