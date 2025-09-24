"use client"

import { Spinner } from "@/components/ui/shadcn-io/spinner";
import DadosPerfil from "@/components/perfil";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
interface resAPI {
    code: number,
    mensagem: string,
    data: { token: string, usuario: { id: string, nome: string, email: string } }
}

interface usuarioDados {
    code: number,
    mensagem: string,
    data: {
        _id: string,
        nome: string,
        email: string,
        whatsapp: string,
        ativo: string
    }
}

interface infoUsuario {
    empresa:string,
    email:string,
    telefone:string
}

interface detectModify {
    value: boolean
}

export default function PerfilPage() {
    const [isEditabel, setEditabel] = useState<string>("pointer-events-none")
    const [isVisible, setVisible] = useState<boolean>(true)
    const [dadosUsuarios, setUsuario] = useState<infoUsuario>()
    const [isLoading, setLoading] = useState<boolean>(true)
    const [isDiferent, setDiferent] = useState<string>("pointer-events-none bg-[#FFFFF0]")
    const [isInputModify, setInput] = useState<detectModify[]>([])
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    async function login() {
        try {
            const userEmail = "silvio.huan@gmail.com";
            const userSenha = "SenhaSuperSegur@123";
            const response = await fetch(
                'http://localhost:1350/login',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'email': 'silvio.huan@gmail.com', 'senha': 'SenhaSuperSegur@123' })
                }
            );

            // Verifica o status da resposta
            if (!response.ok) {
                console.error(`Erro na requisição: ${response.status} - ${response.statusText}`);
                return;
            }

            // Processa os dados retornados
            const dadosProcessados: resAPI = await response.json();
            console.log(dadosProcessados);

            if (dadosProcessados.data?.token) {
                localStorage.token = dadosProcessados.data.token;
                localStorage.id = dadosProcessados.data.usuario.id
            }
        } catch (error) {
            console.error('Erro ao realizar o fetch:', error);
        }
    }
    async function getDados() {
        try {
            const response = await fetch(`http://localhost:1350/usuarios/${localStorage.id}`, { method: 'GET', headers: { 'Authorization': `Bearer ${localStorage.token}`} })
            const dados: usuarioDados = await response.json()
            const perfil:infoUsuario = {
                empresa: dados.data.nome,
                email: dados.data.email,
                telefone: dados.data.whatsapp
            }
            setUsuario(perfil)
            setLoading(false)
        }catch(error:any){
            console.log("Erro ao requisitar dados do usuário", error)
        }
    }
    function gerarPerfil(){

    }
    function saveInputValue() {
        const inputs = document.querySelectorAll<HTMLInputElement>(".dados")
        // console.log(inputs)

        for(const input of inputs){
            if(input.className.includes("email")){
                continue
            }
            const modify:detectModify ={value:false}
            isInputModify.push(modify)
            input.addEventListener("input",()=>{
                if(input.value !== input.defaultValue){
                    modify.value = true
                }
                else{
                    modify.value = false
                }

                if(isInputModify.find(item => item.value === true)){
                    setDiferent("bg-green-600 hover:bg-green-700 text-white")
                }
                else {
                    setDiferent("pointer-events-none bg-[#FFFFF0]")
                }
                if(!buttonRef.current){
                   getButton()
                }
            })
        }
    }
    function getButton(){
        const button_ =  document.querySelector<HTMLButtonElement>("#salvar")
        if(button_){
            buttonRef.current = button_
            console.log(buttonRef.current)
        }
    }
        useEffect(() => {
        login(); getDados();
    }, [])
    return (
        <div className="w-[100%] h-[100%] flex justify-center items-center bg-[#F9FAFB]">
           {isLoading? <div className="h-[750px] w-[869px] flex justify-center items-center"><Spinner/></div> : <div className="h-[750px] w-[869px]">
                <div className="bg-gradient-to-r from-[#9333EA] to-[#4338CA] h-[144px] w-[100%] flex p-[20px] items-center">
                    <div className="flex justify-center items-center gap-[20px] text-[#fff]">
                        <div className="shadow-md h-[80px] w-[80px] rounded-full bg-[#fff] flex justify-center items-center text-[36px] font-bold text-[#9333EA]">{dadosUsuarios?.empresa[0]}</div>
                        <div>
                            <div className="text-[20px] font-bold">{dadosUsuarios?.empresa}</div>
                            <p>Manage your store profile</p>
                        </div>
                    </div>
                </div>
                <div className="w-[100%] bg-[#fff] p-[20px] gap-[20px] flex flex-col">
                    <DadosPerfil
                        campo="Store Name"
                        svg="empresa.svg"
                        info={dadosUsuarios?.empresa as string}
                        obj={{ value: isEditabel }}

                    />
                    <DadosPerfil
                        campo="Email"
                        svg="email.svg"
                        info={dadosUsuarios?.email as string}
                        obj={{ value: "pointer-events-none email" }}

                    />
                    <DadosPerfil
                        campo="WhatsApp Number"
                        svg="telefone.svg"
                        info={dadosUsuarios?.telefone as string}
                        obj={{ value: isEditabel }}
                    />
                    <button onClick={() => { setEditabel("bg-white"); setVisible(false); saveInputValue(); }} className={"bg-[#9333EA] font-medium hover:bg-[#7E22CE] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-[#fff] " + (isVisible ? "" : "hidden")}>Editar</button>
                    <div className={"flex mx-auto gap-[20px] " + (!isVisible ? "" : "hidden")}>
                        <button onClick={() => {setVisible(true); setEditabel("pointer-events-none")}} className={"bg-[#CD5C5C] text-[#fff] font-medium hover:bg-[#B22222] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer "}>Cancelar</button>
                        <button id="salvar" onClick={() => { setEditabel(""); }} className={"font-medium hover:bg-[#7E22CE] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer " + isDiferent}>Salvar</button>
                    </div>
                </div>
            </div> }
        </div>
    );
}