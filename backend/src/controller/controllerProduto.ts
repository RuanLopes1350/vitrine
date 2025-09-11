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

    async buscarPorId(id:string) {
        const dados = await this.service.buscarPorId(id);
        return dados;
    }

    async deletar(id:string){
        const dados = await this.service.deletar(id);
        return dados;
    }
}

export default ControllerProduto;