import ServiceUsuario from "../service/serviceUsuario";
import { typeUsuario } from "../types/typeUsuario";

class ControllerUsuario {
    private service:ServiceUsuario

    constructor(){
        this.service = new ServiceUsuario
    }

    async cadastrar(dadosUsuario:typeUsuario) {
        const usuario = await this.service.cadastrar(dadosUsuario)
        return usuario
    }

    async listar() {
        const dados = await this.service.listar()
        return dados
    }

    async buscarPorId(id: string) {
        const dados = await this.service.buscarPorId(id)
        return dados;
    }

    async deletar(id:string) {
        return await this.service.deletar(id);
    }
}

export default ControllerUsuario;