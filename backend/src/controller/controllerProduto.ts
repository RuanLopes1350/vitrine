import ServiceProduto from "../service/serviceProduto";
import { typeProduto, typeProdutoEdicao } from "../types/typeProduto";
import { CommonResponse } from "../utils/helpers/commonResponse";

class ControllerProduto {
    private service: ServiceProduto

    constructor() {
        this.service = new ServiceProduto();
    }

    async cadastrar(dadosProduto: typeProduto): Promise<CommonResponse> {
        return await this.service.cadastrar(dadosProduto);
    }

    async listar(): Promise<CommonResponse> {
        return await this.service.listar();
    }

    async buscarPorId(id: string): Promise<CommonResponse> {
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