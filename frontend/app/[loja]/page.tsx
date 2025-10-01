"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useProdutosLoja } from "@/hooks/useLoja";
import { usePathname } from "next/navigation";

export default function PageLoja(){
    const {produtos, getProdutos} = useProdutosLoja()
    const [id, getId] = useState<string>("")
    const local = usePathname()
    useEffect(()=>{
        const id = local.match(/[0-9a-fA-F]{24}/)?.[0] as string
        getProdutos(id)
    },[])

    return(
        <div>
            {produtos?.data.docs[0].criador.nomeLoja}
        </div>
    )
}