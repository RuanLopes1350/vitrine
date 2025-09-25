"use client"

import Modal from "@/components/modal";
import ModalError from "@/components/modalError";

import { useState, useRef, useEffect } from "react";

export default function PerfilPage() {
    const [descError, setIsDescError] = useState<string>("")
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
    const [isVisible, setVisible] = useState<boolean>(true)
    const [isInterable, setInterable] = useState<string>("pointer-events-none select-none")
    const [nome, setNome] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [telefone, setTelefone] = useState<string>()
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("nome", "Silvio Huan");
            localStorage.setItem("email", "silvio.huan@gmail.com");
            localStorage.setItem("telefone", "6988447766");
            let nome: string = localStorage.getItem("nome") as string
            let email: string = localStorage.getItem("email") as string
            let telefone: string = localStorage.getItem("telefone") as string
            setNome(nome)
            setEmail(email)
            setTelefone(telefone)
        }
    }, []);

    const nomeRef = useRef<HTMLInputElement>(null)
    const telefoneRef = useRef<HTMLInputElement>(null)
    function restaurarDados() {
        if (nomeRef.current) {
            nomeRef.current.value = localStorage.getItem("nome") as string
        }
        if (telefoneRef.current) {
            telefoneRef.current.value = localStorage.getItem("telefone") as string
        }
        setVisible(true)
    }
    function validarDados() {
        const telefoneRegex = /^\d+$/
        const nomeRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/
        const nome = nomeRef.current?.value.trim() as string
        const telefone = telefoneRef.current?.value.trim() as string
        console.log("Nome:", nome)
        console.log("Telefone:", telefone)
        if (telefone?.length < 10 || telefone?.length > 11) {
            setIsDescError(`O número de telefone deve ter entre 10 e 11 digitos! Exemplo: 99 9999-9999 ou 99 99999-9999 sem espaçamentos ou hífen.`)
            setIsErrorModalOpen(true)
            return
        }
        if (!telefoneRegex.test(telefone)) {
            setIsDescError("O telefone deve conter somente números e sem espaços!")
            setIsErrorModalOpen(true)
            return
        }
        if (!nomeRegex.test(nome)) {
            setIsDescError("O nome deve conter somente numeros e letras, sem caracteres especiais!")
            setIsErrorModalOpen(true)
            return
        }
        setNome(nome)
        setTelefone(telefone)
        if(nomeRef.current?.value && telefoneRef.current?.value){
            nomeRef.current.value = nome
            telefoneRef.current.value = telefone
        }
        localStorage.setItem("nome", nome)
        localStorage.setItem("telefone", telefone)
        setVisible(true)
        setInterable("pointer-events-none select-none")
    }
    return (

        <div className="w-[100%] h-[100%] flex justify-center items-center bg-[#F9FAFB]">
            <ModalError
                tipoErro="Erro de Validação"
                descricao={descError}
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
            />
            <div className="h-[750px] w-[869px] rounded-[16px]">
                <div className="bg-gradient-to-r from-[#9333EA] to-[#4338CA] h-[144px] w-[100%] flex p-[20px] items-center rounded-t-[16px]">
                    <div className="flex justify-center items-center gap-[20px] text-[#fff]">
                        <div className="shadow-md h-[80px] w-[80px] rounded-full bg-[#fff] flex justify-center items-center text-[36px] font-bold text-[#9333EA]">{nome ? nome[0] : ""}</div>
                        <div>
                            <div className="text-[20px] font-bold">{nome}</div>
                            <p>Gerencie o perfil da sua loja</p>
                        </div>
                    </div>
                </div>
                <div className="w-[100%] bg-[#fff] p-[20px] gap-[20px] flex flex-col rounded-b-[16px]">
                    <div className="bg-[#FAF5FF] flex flex-col gap-[10px] p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="empresa.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">Nome da Empresa</span>
                        </div>
                        <input ref={nomeRef} type="text" className={"font-medium border-none focus:outline-none dados " + isInterable} defaultValue={nome} />
                    </div>
                    <div className="bg-[#FAF5FF] flex flex-col gap-[10px] p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="email.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">E-mail</span>
                        </div>
                        <input type="text" className="font-medium border-none focus:outline-none dados " readOnly defaultValue={email} />
                    </div>
                    <div className="bg-[#FAF5FF] flex flex-col gap-[10px] p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="telefone.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">Whatsapp</span>
                        </div>
                        <input ref={telefoneRef} type="text" className={"font-medium border-none focus:outline-none dados " + isInterable} defaultValue={telefone} />
                    </div>
                    <button onClick={() => { setVisible(false); setInterable("bg-[#fff]") }} className={"bg-[#9333EA] font-medium hover:bg-[#7E22CE] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-[#fff] " + (isVisible ? "" : "hidden")}>Editar</button>
                    <div className={"flex mx-auto gap-[20px] " + (!isVisible ? "" : "hidden")}>
                        <button onClick={() => { setInterable("pointer-events-none select-none"); restaurarDados() }} className={"bg-[#CD5C5C] text-[#fff] font-medium hover:bg-[#B22222] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer "}>Cancelar</button>
                        <button onClick={() => { validarDados(); }} id="salvar" className="font-medium bg-green-600 text-[#fff] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer hover:bg-green-700 ">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}