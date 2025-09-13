import ServiceUsuario from "../service/serviceUsuario";
import { typeUsuario } from "../types/typeUsuario";
import { CommonResponse } from "../utils/helpers/commonResponse";

class ControllerUsuario {
    private service:ServiceUsuario

    constructor(){
        this.service = new ServiceUsuario
    }

    async cadastrar(dadosUsuario:typeUsuario): Promise<CommonResponse> {
        const usuario = await this.service.cadastrar(dadosUsuario)
        return usuario
    }

    async listar(): Promise<CommonResponse> {
        const dados = await this.service.listar()
        return dados
    }

    async buscarPorId(id: string): Promise<CommonResponse> {
        const dados = await this.service.buscarPorId(id)
        return dados;
    }

    async atualizar(id:string, dadosUsuario:typeUsuario): Promise<CommonResponse> {
        return await this.service.atualizar(id, dadosUsuario);
    }

    async deletar(id:string): Promise<CommonResponse> {
        return await this.service.deletar(id);
    }
}

export default ControllerUsuario;