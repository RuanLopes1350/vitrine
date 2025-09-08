import RepositoryUsuario from "../repository/repositoryUsuario";
import { typeUsuario } from "../types/typeUsuario";

class ServiceUsuario {
    private repository: RepositoryUsuario
    constructor() {
        this.repository = new RepositoryUsuario
    }

    async cadastrar(dadosUsuario:typeUsuario) {
        // TODO: Implementar regras de negócios.
        const usuario = await this.repository.cadastrar(dadosUsuario)
        return usuario;
    }

    async listar(){
        const dados = await this.repository.listar()
        return dados
    }
}

export default ServiceUsuario;