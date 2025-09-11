import RepositoryUsuario from "../repository/repositoryUsuario";
import { typeUsuario } from "../types/typeUsuario";

class ServiceAuth {
    private usuarioRepository: RepositoryUsuario
    constructor (){
        this.usuarioRepository = new RepositoryUsuario()
    }

    async login(email:string, senha:string){
        try{
            const usuario:typeUsuario = await this.usuarioRepository.buscarPorEmail(email)
            if(!usuario){
                throw new Error("Senha ou Email incorretos")
            }
            if(usuario.senha !== senha) {
                throw new Error("Senha ou Email incorretos")
            }
            return usuario

        }catch(erro){
            console.log(erro,'Deu ruim aqui')
            throw new Error(erro)

        }
    }
}