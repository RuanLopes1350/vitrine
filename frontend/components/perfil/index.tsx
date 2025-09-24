"use client"

import { Edit } from "lucide-react"
import { useState } from "react"

interface perfil {
    campo:string,
    svg:string,
    info:string,
    obj:{value:string}
}
// import { useState } from "react"

export default function DadosPerfil({ campo, svg, info, obj}: perfil) {
    const [isEditabel, setEditabel] = useState<string>()
    return (
        <div className="bg-[#FAF5FF] flex flex-col gap-[10px] p-[20px] rounded-[12px]">
            <div className="flex gap-[10px] items-center">
                <img src={svg} alt="" />
                <span className="text-[12px] text-[#6B7280]">{campo}</span>
            </div>
            <input type="text" className={"font-medium border-none focus:outline-none dados "+obj.value} defaultValue={info}/>
        </div>
    )
}