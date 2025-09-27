"use client"

import ModalError from "@/components/modalError";
import axios from "axios"
import { useState, useRef, useEffect } from "react";

export default function PerfilPage() {

    const [descError, setIsDescError] = useState<string>("")
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);
    const [isVisible, setVisible] = useState<boolean>(true)
    const [isInterable, setInterable] = useState<string>("pointer-events-none select-none")
    const [nome, setNome] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [whatsapp, setWhatsapp] = useState<string>()
    const [aviso, setAviso] = useState<string>("Erro de validação")

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("nome", "Silvio Huan");
            localStorage.setItem("email", "silvio.huan@gmail.com");
            localStorage.setItem("whatsapp", "6988447766");
            let nome: string = localStorage.getItem("nome") as string
            let email: string = localStorage.getItem("email") as string
            let whatsapp: string = localStorage.getItem("whatsapp") as string
            setNome(nome)
            setEmail(email)
            setWhatsapp(whatsapp)
        }
        if(process.env.NEXT_PUBLIC_NODE_ENV === "development"){
            localStorage.setItem("token", process.env.NEXT_PUBLIC_TOKEN as string)
            localStorage.setItem("id", process.env.NEXT_PUBLIC_FAKE_ID as string)
            localStorage.setItem("api", process.env.NEXT_PUBLIC_API_URI as string)
        }

    }, []);

    const nomeRef = useRef<HTMLInputElement>(null)
    const whatsappRef = useRef<HTMLInputElement>(null)
    async function postDados(nome: string, whatsapp: string) {

        try {

            const dados = {
                nome: nome,
                whatsapp: whatsapp
            }

            const token = localStorage.getItem("token")

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            console.log("Aqui")
            const id = localStorage.getItem("id")
            const uri = localStorage.getItem("api")
            const resposta = await axios.patch(`${uri}/usuarios/${id}`, dados, { headers })

            if (resposta.status === 200) {

                if (nomeRef.current?.value && whatsappRef.current?.value) {

                    nomeRef.current.value = nome
                    whatsappRef.current.value = whatsapp
                }

                localStorage.setItem("nome", nome)
                localStorage.setItem("whatsapp", whatsapp)
                setVisible(true)
                setInterable("pointer-events-none select-none")
                setNome(nome)
                setWhatsapp(whatsapp)
                localStorage.setItem("nome", nome)
                localStorage.setItem("whatsapp", whatsapp)
                setVisible(true)
                setInterable("pointer-events-none select-none")

                return
            } 
            setAviso("Erro ao salvar alterações!")
            setIsDescError(`Não foi possivel salvar as alterações, erro ${resposta.status}`)
            setIsErrorModalOpen(true) 

        } catch (erro:any) {
            restaurarDados()
            setInterable("pointer-events-none select-none")
            setAviso("Erro desconhecido")
            setIsDescError(`Não foi possivel salvar as alterações, erro ${erro.response.status}`)
            setIsErrorModalOpen(true)
        }

    }
    function restaurarDados() {
        if (nomeRef.current) {
            nomeRef.current.value = localStorage.getItem("nome") as string
        }
        if (whatsappRef.current) {
            whatsappRef.current.value = localStorage.getItem("whatsapp") as string
        }
        setVisible(true)
    }
    async function validarDados() {

        const whatsappRegex = /^\d+$/
        const nomeRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/
        const nome = nomeRef.current?.value.trim() as string
        const whatsapp = whatsappRef.current?.value.trim() as string

        if (whatsapp?.length < 10 || whatsapp?.length > 11) {

            setAviso("Erro de Validação!")
            setIsDescError(`O número de whatsapp deve ter entre 10 e 11 digitos! Exemplo: 99 9999-9999 ou 99 99999-9999 sem espaçamentos ou hífen.`)
            setIsErrorModalOpen(true)
            return
        }

        if (!whatsappRegex.test(whatsapp)) {

            setAviso("Erro de Validação!")
            setIsDescError("O whatsapp deve conter somente números e sem espaços!")
            setIsErrorModalOpen(true)
            return
        }

        if (!nomeRegex.test(nome)) {

            setAviso("Erro de Validação!")
            setIsDescError("O nome deve conter somente numeros e letras, sem caracteres especiais!")
            setIsErrorModalOpen(true)
            return
        }

        await postDados(nome, whatsapp)
    }
    return (
        <div className="w-[100%] h-[100%] flex justify-center items-center bg-[#F9FAFB]">
            <ModalError
                tipoErro={aviso}
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
                            <img src="whatsapp.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">Whatsapp</span>
                        </div>
                        <input ref={whatsappRef} type="text" className={"font-medium border-none focus:outline-none dados " + isInterable} defaultValue={whatsapp} />
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