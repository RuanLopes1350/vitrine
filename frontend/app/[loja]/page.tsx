"use client"
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function PageLoja(){
    const {user, logout} = useAuth()
    const [nomeLoja, setIsNomeLoja] = useState<string>()
    const [idUser, setIsIdUser] = useState<string>()
    async function getLoja(nome:string, id:string) {
        try{

            

        }catch(erro){
            console.log(erro)
        }
    }
    useEffect(()=>{
        if(user){
            setIsNomeLoja(user.nomeLoja)
            setIsIdUser(user.id)
        }
    },[])
    return(
        <div>
            Está loja está online
        </div>
    )
}