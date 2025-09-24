"use client"

import DadosPerfil from "@/components/perfil";
import { useState } from "react";

export default function PerfilPage() {
    const [isEditabel, setEditabel] = useState<string>("pointer-events-none")
    const [isVisible, setVisible] = useState<boolean>(true)
    function saveInputValue(){
        const input = document.querySelectorAll(".dados")
        
    }
    return (
        <div className="w-[100%] h-[100%] flex justify-center items-center bg-[#F9FAFB]">
            <div className="h-[750px] w-[869px]">
                <div className="bg-gradient-to-r from-[#9333EA] to-[#4338CA] h-[144px] w-[100%] flex p-[20px] items-center">
                    <div className="flex justify-center items-center gap-[20px] text-[#fff]">
                        <div className="shadow-md h-[80px] w-[80px] rounded-full bg-[#fff] flex justify-center items-center text-[36px] font-bold text-[#9333EA]">M</div>
                        <div>
                            <div className="text-[20px] font-bold">Millennium</div>
                            <p>Manage your store profile</p>
                        </div>
                    </div>
                </div>
                <div className="w-[100%] bg-[#fff] p-[20px] gap-[20px] flex flex-col">
                    <DadosPerfil
                        campo="Store Name"
                        svg="empresa.svg"
                        info="Millenal"
                        obj={{value: isEditabel}}

                    />
                    <DadosPerfil
                        campo="Email"
                        svg="email.svg"
                        info="johndoe@email.com"
                        obj={{value: "pointer-events-none"}}

                    />
                    <DadosPerfil
                        campo="WhatsApp Number"
                        svg="telefone.svg"
                        info="556911223344"
                        obj={{value: isEditabel}}

                    />
                    <button onClick={() => {setEditabel("bg-white"); setVisible(false)}} className={"bg-[#9333EA] font-medium hover:bg-[#7E22CE] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer "+(isVisible? "":"hidden")}>Editar</button>
                    <div className={"flex mx-auto gap-[20px] "+ (!isVisible? "":"hidden")}>
                        <button onClick={() => setVisible(true)} className={"bg-[#9333EA] font-medium hover:bg-[#7E22CE] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer "}>Cancelar</button>
                        <button onClick={() =>{setEditabel("")}}className={"bg-[#9333EA] font-medium hover:bg-[#7E22CE] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer "}>Salvar</button>
                    </div>
                </div>
                {/* <div className="w-[100%] bg-[#fff] p-[20px] gap-[20px] flex flex-col">
                </div> */}
            </div>
        </div>
    );
}