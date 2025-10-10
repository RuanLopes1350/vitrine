import mongoose, { PaginateModel } from "mongoose";
import { typeProduto, typeProdutoEdicao } from '../types/typeProduto.js';
import modelProduto from '../models/modelProduto.js';
import { Request } from "express";
import { Query } from "../types/typeQuery.js";
import modelUsuario from "../models/modelUsuario.js";

class RepositoryProduto {
    private model: PaginateModel<any>;
    private usuarioModel: PaginateModel<any>

    constructor(model = modelProduto) {
        this.model = model as PaginateModel<any>;
        this.usuarioModel = modelUsuario as PaginateModel<any>
    }

    async cadastrar(dadosProduto: typeProduto): Promise<any> {
        const produto = new this.model(dadosProduto);
        return await produto.save();
    }

    async listar() {
        const dados = await this.model.find().populate('criador', 'whatsapp');
        return dados;
    }

    async buscarPorId(id: string) {
        const dados = await this.model.findById(id).populate('criador', 'whatsapp');
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

    async buscarTodosProdutosUsuario(req: Request<any, any, Query>, id:string){
        const { page=1} = req.query
        const limit = Math.min(parseInt(req.query.limit as string, 10) || 20, 1000)
        const options = {
            page: parseInt(page as string, 10),
            limit: limit,
            populate: {
                path: 'criador',
                select: 'nomeLoja whatsapp mensagem fotoPerfil'
            }
        }

        const dados = await this.model.paginate({criador: id}, options)
        return dados
    }
}

export default RepositoryProduto;