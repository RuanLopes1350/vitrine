
"use client"

import ModalError from "@/components/modalError";
import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/hooks/useAuth";
import apiClient from "@/apiClient";
import { useState, useRef, useEffect } from "react";


export default function PerfilPage() {
    // Hook que protege a rota - redireciona para login se não autenticado
    const { isAuthenticated, isLoading } = useRequireAuth();
    // Context de autenticação
    const { user, logout } = useAuth();

    const [descError, setIsDescError] = useState<string>("")
    const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false)
    const [isVisible, setVisible] = useState<boolean>(true)
    const [isInterable, setInterable] = useState<string>("pointer-events-none select-none")
    const [nomeLoja, setNomeLoja] = useState<string>("")
    const [nome, setNome] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [whatsapp, setWhatsapp] = useState<string>("")
    const [aviso, setAviso] = useState<string>("Erro de validação")

    // Carregar dados do usuário logado
    useEffect(() => {
        if (user) {
            setNome(user.nome || "");
            setNomeLoja(user.nomeLoja || "");
            setEmail(user.email || "");
            setWhatsapp(user.whatsapp || "");
        }
    }, [user]);

    const nomeRefLoja = useRef<HTMLInputElement>(null)
    const whatsappRef = useRef<HTMLInputElement>(null)
    
    async function postDados(nomeLoja: string, whatsapp: string) {
        try {
            const dados = {
                nomeLoja: nomeLoja,
                whatsapp: whatsapp
            }

            // Usar o apiClient que já tem o token configurado automaticamente
            const resposta = await apiClient.patch(`/usuarios/${user?.id}`, dados);

            if (resposta.status === 200) {
                if (nomeRefLoja.current?.value && whatsappRef.current?.value) {
                    nomeRefLoja.current.value = nomeLoja
                    whatsappRef.current.value = whatsapp
                }

                // Atualizar estados locais
                setNomeLoja(nomeLoja)
                setWhatsapp(whatsapp)
                if(user){
                    user.nomeLoja = nomeLoja
                    user.whatsapp = whatsapp
                }
                setVisible(true)
                setInterable("pointer-events-none select-none")

                return
            } 
            setAviso("Erro ao salvar alterações!")
            setIsDescError(`Não foi possivel salvar as alterações, erro ${resposta.status}`)
            setIsErrorModalOpen(true) 

        } catch (erro: any) {
            // O apiClient já trata 401/403 automaticamente fazendo logout
            if (erro.response?.status === 403 || erro.response?.status === 401) {
                logout();
                return
            }
            
            restaurarDados()
            setInterable("pointer-events-none select-none")
            setAviso("Erro desconhecido")
            setIsDescError(`Não foi possivel salvar as alterações, erro ${erro.response?.status || 'desconhecido'}`)
            setIsErrorModalOpen(true)
        }
    }
    function restaurarDados() {
        if (nomeRefLoja.current && user?.nomeLoja) {
            nomeRefLoja.current.value = user.nomeLoja
        }
        if (whatsappRef.current && user?.whatsapp) {
            whatsappRef.current.value = user.whatsapp
        }
        setVisible(true)
    }
    async function validarDados() {

        const whatsappRegex = /^\d+$/
        const nomeRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/
        const nomeLoja = nomeRefLoja.current?.value.trim() as string
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

        if (!nomeRegex.test(nomeLoja)) {

            setAviso("Erro de Validação!")
            setIsDescError("O nome deve conter somente numeros e letras, sem caracteres especiais!")
            setIsErrorModalOpen(true)
            return
        }

        await postDados(nomeLoja, whatsapp)
    }

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-[#F9FAFB]">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-700">Carregando...</div>
                </div>
            </div>
        );
    }

    // Se não estiver autenticado, o hook já redirecionará
    if (!isAuthenticated) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-[#F9FAFB]">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-700">Redirecionando...</div>
                </div>
            </div>
        );
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
                        <div className="shadow-md h-[80px] w-[80px] rounded-full bg-[#fff] flex justify-center items-center text-[36px] font-bold text-[#9333EA]">
                            {nome ? nome[0].toUpperCase() : "U"}
                        </div>
                        <div>
                            <div className="text-[20px] font-bold">{nome || user?.nome}</div>
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
                        <input 
                            ref={nomeRefLoja} 
                            type="text" 
                            className={"font-medium border-none focus:outline-none dados " + isInterable} 
                            defaultValue={nomeLoja || user?.nomeLoja} 
                        />
                    </div>
                    <div className="bg-[#FAF5FF] flex flex-col gap-[10px] p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="email.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">E-mail</span>
                        </div>
                        <input 
                            type="text" 
                            className="font-medium border-none focus:outline-none dados " 
                            readOnly 
                            defaultValue={email || user?.email} 
                        />
                    </div>
                    <div className="bg-[#FAF5FF] flex flex-col gap-[10px] p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="whatsapp.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">Whatsapp</span>
                        </div>
                        <input 
                            ref={whatsappRef} 
                            type="text" 
                            className={"font-medium border-none focus:outline-none dados " + isInterable} 
                            defaultValue={whatsapp || user?.whatsapp} 
                        />
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