import mongoose from "mongoose";
import { typeProduto, typeProdutoEdicao } from '../types/typeProduto';
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

    async buscarPorId(id: string) {
        const dados = await this.model.findById(id);
        return dados;
    }

    async editar(id: string, dadosProduto: typeProdutoEdicao) {
        const dados = await this.model.findByIdAndUpdate(
            id,
            dadosProduto,
            { new: true, runValidators: true }
        );
        return dados;
    }

    async deletar(id: string) {
        return await this.model.findByIdAndDelete(id)

    }
}

export default RepositoryProduto;