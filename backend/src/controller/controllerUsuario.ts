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
}

export default ControllerUsuario;