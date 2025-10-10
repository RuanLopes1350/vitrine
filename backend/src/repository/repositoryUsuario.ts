import mongoose from "mongoose";
import { typeUsuario } from '../types/typeUsuario.js';
import modelUsuario from '../models/modelUsuario.js';

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
        return user;
    }

    async atualizar(id: string, dadosUsuario: Partial<typeUsuario>) {
        return await this.model.findByIdAndUpdate(id, dadosUsuario, { new: true });
    }

    async deletar(id: string) {
        return await this.model.findByIdAndDelete(id);
    }

    async buscarPorEmail(email:string) {

        const data = await this.model.findOne({email:email}, ' +fotoPerfil +senha +nomeLoja +whatsapp +ativo' );

        return data
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

    async buscarPorCodigoRecuperacao(codigo:string) {
        const filtro = {codigoRecuperaSenha: codigo};
        const documento = await this.model.findOne(filtro,[ '+expCodigoRecuperaSenha', '+codigoRecuperaSenha'])
        return documento
    }
}

export default RepositoryUsuario;