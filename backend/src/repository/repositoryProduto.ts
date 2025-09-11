import mongoose from "mongoose";
import { typeProduto } from '../types/typeProduto';
import modelProduto from '../models/modelProduto';

class RepositoryProduto {
    private model: mongoose.Model<any>;

    constructor(model = modelProduto) {
        this.model = model;
    }

    async cadastrar(dadosProduto: typeProduto): Promise<any> {
        const produto = new this.model(dadosProduto);
        return await produto.save();
    }

    async listar() {
        const dados = await this.model.find();
        return dados;
    }

    async buscarPorId(id:string) {
        const dados = await this.model.findById(id);
        return dados;
    }
}

export default RepositoryProduto;