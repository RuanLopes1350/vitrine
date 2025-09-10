import mongoose from "mongoose";
import { typeUsuario } from '../types/typeUsuario';
import modelUsuario from '../models/modelUsuario';

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

    async buscarPorId(id: string) {
        const usuario = await this.model.findById(id);
        return usuario;
    }

    async deletar (id: string) {
        return await this.model.findByIdAndDelete(id);
    }
}

export default RepositoryUsuario;