import ServiceProduto from "../service/serviceProduto";
import { typeProduto } from "../types/typeProduto";

class ControllerProduto {
    private service: ServiceProduto

    constructor() {
        this.service = new ServiceProduto();
    }

    async cadastrar(dadosProduto: typeProduto) {
        const produto = await this.service.cadastrar(dadosProduto);
        return produto;
    }

    async listar() {
        const dados = await this.service.listar();
        return dados;
    }
}

export default ControllerProduto;