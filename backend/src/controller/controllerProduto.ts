import ServiceProduto from "../service/serviceProduto.js";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto.js";
import { CommonResponse } from "../utils/helpers/commonResponse.js";

class ControllerProduto {
    private service: ServiceProduto

    constructor() {
        this.service = new ServiceProduto();
    }

    async cadastrar(dadosProduto: typeProduto): Promise<CommonResponse> {
        console.log('Cadastrando produto');
        return await this.service.cadastrar(dadosProduto);
    }

    async listar(): Promise<CommonResponse> {
        console.log('Listando produtos');
        return await this.service.listar();
    }

    async buscarPorId(id: string): Promise<CommonResponse> {
        console.log('Buscando produto por ID:', id);
        return await this.service.buscarPorId(id);
    }

    async editar(id: string, dadosProduto: typeProdutoEdicao): Promise<CommonResponse> {
        return await this.service.editar(id, dadosProduto);
    }

    async deletar(id: string): Promise<CommonResponse> {
        return await this.service.deletar(id);
    }
}

export default ControllerProduto;