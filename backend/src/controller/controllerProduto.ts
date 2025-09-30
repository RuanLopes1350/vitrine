import ServiceProduto from "../service/serviceProduto.js";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto.js";
import { CommonResponse } from "../utils/helpers/commonResponse.js";

class ControllerProduto {
    private service: ServiceProduto

    constructor() {
        this.service = new ServiceProduto();
    }

    async validar(dadosProduto: typeProduto, userId: string): Promise<CommonResponse> {
        console.log('Validando dados do produto para usuário:', userId);
        // Adicionar o criador aos dados do produto para validação
        const produtoComCriador = {
            ...dadosProduto,
            criador: userId
        };
        return await this.service.validar(produtoComCriador);
    }

    async cadastrar(dadosProduto: typeProduto, userId: string): Promise<CommonResponse> {
        console.log('Cadastrando produto para usuário:', userId);
        // Adicionar o criador aos dados do produto
        const produtoComCriador = {
            ...dadosProduto,
            criador: userId
        };
        return await this.service.cadastrar(produtoComCriador);
    }

    async listar(): Promise<CommonResponse> {
        console.log('Listando produtos');
        return await this.service.listar();
    }

    async buscarPorId(id: string): Promise<CommonResponse> {
        console.log('Buscando produto por ID:', id);
        return await this.service.buscarPorId(id);
    }

    async editar(id: string, dadosProduto: typeProdutoEdicao, userId: string): Promise<CommonResponse> {
        console.log('Editando produto:', id, 'para usuário:', userId);
        return await this.service.editar(id, dadosProduto, userId);
    }

    async deletar(id: string, userId: string): Promise<CommonResponse> {
        console.log('Deletando produto:', id, 'para usuário:', userId);
        return await this.service.deletar(id, userId);
    }
}

export default ControllerProduto;