import { typeLogin } from "../types/typeLogin";
import ServiceAuth from '../service/serviceAuth'

class ControllerAuth {
    private service: ServiceAuth
    constructor(){
        this.service = new ServiceAuth ()
    }
    async login(usuario:typeLogin){
        console.log(usuario)
        const data =  await this.service.login(usuario.email, usuario.senha)

        return data
    }

    async logout(id:string){

    }
    async recover(){
        
    }
}
export default ControllerAuth