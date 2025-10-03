
"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/hooks/useAuth";
import apiClient from "@/apiClient";
import { useState, useRef, useEffect } from "react";
import { useToast, ToastContainer } from "@/components/ui/toast";

interface ErrorResponse {
    response?: {
        data?: {
            erro?: boolean,
            code?: number,
            mensagem?: string,
            erros?: string[] | {
                campo: string,
                mensagem: string
            }[]
        },
        status?: number,
        statusText?: string
    },
    message?: string,
    name?: string
}

export default function PerfilPage() {
    // Hook que protege a rota - redireciona para login se não autenticado
    const { isAuthenticated, isLoading } = useRequireAuth();
    // Context de autenticação
    const { user, logout, updateUser } = useAuth();
    // Hook do toast para mensagens
    const { toasts, showSuccess, showError, removeToast } = useToast();

    // ✅ Função utilitária para mostrar erros da API
    const showApiError = (erro: ErrorResponse, defaultMessage: string = "Erro inesperado") => {
        const data = erro.response?.data;
        
        const mensagem = data?.mensagem || defaultMessage;
        
        // Se há erros específicos (422), verificar o tipo
        if (data?.code === 422 && Array.isArray(data.erros) && data.erros.length > 0) {
            const primeiroErro = data.erros[0];
            
            // Verificar se é string ou objeto
            if (typeof primeiroErro === 'string') {
                // Lista de strings: ["Campo whatsapp é obrigatório", "Email inválido"]
                showError(primeiroErro);
            } else {
                // Lista de objetos: [{campo: "whatsapp", mensagem: "..."}]
                const mensagemEspecifica = `${primeiroErro.campo}: ${primeiroErro.mensagem}`;
                showError(mensagemEspecifica);
            }
            return;
        }
        
        showError(mensagem);
    };

    // Estados que ainda são necessários para o funcionamento do componente
    const [isVisible, setVisible] = useState<boolean>(true)
    const [isInterable, setInterable] = useState<string>("pointer-events-none select-none")
    const [nomeLoja, setNomeLoja] = useState<string>("")
    const [nome, setNome] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [whatsapp, setWhatsapp] = useState<string>("")

    // Função para formatar WhatsApp com () e -
    const formatWhatsApp = (value: string): string => {
        // Remove tudo que não for número
        const numbersOnly = value.replace(/\D/g, '');

        if (numbersOnly.length <= 2) {
            return `(${numbersOnly}`;
        } else if (numbersOnly.length <= 6) {
            return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
        } else if (numbersOnly.length <= 10) {
            return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 6)}-${numbersOnly.slice(6)}`;
        } else {
            return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2, 7)}-${numbersOnly.slice(7, 11)}`;
        }
    };

    // Função para converter WhatsApp formatado de volta para apenas números
    const unformatWhatsApp = (value: string): string => {
        return value.replace(/\D/g, '');
    };

    // Função para formatar WhatsApp vindo da API
    const formatWhatsAppFromAPI = (whatsapp: string): string => {
        if (!whatsapp) return '';

        // Remove o prefixo 55 se existir
        const whatsappSemPrefixo = whatsapp.startsWith('55') ? whatsapp.slice(2) : whatsapp;

        // Aplica a formatação
        return formatWhatsApp(whatsappSemPrefixo);
    };

    // Função para aplicar máscara em tempo real
    const handleWhatsAppChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatWhatsApp(event.target.value);
        event.target.value = formatted;
        setWhatsapp(formatted);
    };

    // Carregar dados do usuário logado
    useEffect(() => {
        if (user) {
            setNome(user.nome || "");
            setNomeLoja(user.nomeLoja || "");
            setEmail(user.email || "");
            setWhatsapp(formatWhatsAppFromAPI(user.whatsapp || ""));
        }
    }, [user]);

    const nomeRefLoja = useRef<HTMLInputElement>(null)
    const whatsappRef = useRef<HTMLInputElement>(null)

    async function postDados(nomeLoja: string, whatsapp: string) {
        try {
            const dados = {
                nomeLoja: nomeLoja,
                whatsapp: "55" + unformatWhatsApp(whatsapp)

            }
            console.log(dados.whatsapp)

            // Usar o apiClient que já tem o token configurado automaticamente
            const resposta = await apiClient.patch(`/usuarios/${user?.id}`, dados);

            if (resposta.status === 200) {
                if (nomeRefLoja.current?.value && whatsappRef.current?.value) {
                    nomeRefLoja.current.value = nomeLoja
                    whatsappRef.current.value = whatsapp
                }

                // ✅ Atualizar o user no contexto corretamente
                updateUser({
                    nomeLoja: nomeLoja,
                    whatsapp: "55" + unformatWhatsApp(whatsapp) // com prefixo para manter consistência no contexto
                });

                // Atualizar estados locais
                setNomeLoja(nomeLoja)
                setWhatsapp(whatsapp) // sem prefixo para display
                setVisible(true)
                setInterable("pointer-events-none select-none")

                // ✅ Toast de sucesso
                showSuccess("Dados salvos com sucesso!");
                return
            }

            // ✅ Toast de erro para falha na resposta
            showError(`Erro ao salvar alterações: ${resposta.status}`);

        } catch (erro: unknown) {
            // Type guard para verificar se é um erro do Axios
            const isAxiosError = (error: unknown): error is ErrorResponse => {
                return typeof error === 'object' &&
                    error !== null &&
                    'response' in error;
            };

            if (isAxiosError(erro)) {
                const data = erro.response?.data;
                const statusCode = data?.code || erro.response?.status;

                // Erro de validação (422)
                if (statusCode === 422) {
                    restaurarDados();
                    setInterable("pointer-events-none select-none");
                    // ✅ Usar função utilitária para mostrar erro personalizado
                    showApiError(erro, "Erro de validação nos dados enviados");
                    return;
                }

                // O apiClient já trata 401/403 automaticamente fazendo logout
                if (statusCode === 403 || statusCode === 401) {
                    logout();
                    return;
                }

                restaurarDados();
                setInterable("pointer-events-none select-none");
                // ✅ Usar função utilitária para mostrar erro personalizado
                showApiError(erro, `Erro ao salvar alterações (${statusCode})`);

            } else {
                // Erro genérico (rede, etc.)
                restaurarDados();
                setInterable("pointer-events-none select-none");
                // ✅ Toast para erro de conexão
                showError("Erro de conexão. Verifique sua internet e tente novamente.");
            }
        }
    }
    function restaurarDados() {
        if (nomeRefLoja.current && user?.nomeLoja) {
            nomeRefLoja.current.value = user.nomeLoja
        }
        if (whatsappRef.current && user?.whatsapp) {
            const whatsappSemPrefixo = user.whatsapp.startsWith('55')
                ? user.whatsapp.slice(2)
                : user.whatsapp;
            whatsappRef.current.value = formatWhatsApp(whatsappSemPrefixo);
        }
        setVisible(true)
    }
    async function validarDados() {

        const whatsappRegex = /^\d+$/
        const nomeRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/
        const nomeLoja = nomeRefLoja.current?.value.trim() as string
        const whatsapp = unformatWhatsApp(whatsappRef.current?.value.trim() as string)

        if (whatsapp?.length < 10 || whatsapp?.length > 11) {
            // ✅ Toast para erro de WhatsApp
            showError("O número de WhatsApp deve ter entre 10 e 11 dígitos! Exemplo: 99 9999-9999 ou 99 99999-9999");
            return
        }

        if (!whatsappRegex.test(whatsapp)) {
            // ✅ Toast para erro de formato do WhatsApp
            showError("O WhatsApp deve conter somente números, sem espaços!");
            return
        }

        if (!nomeRegex.test(nomeLoja)) {
            // ✅ Toast para erro do nome da loja
            showError("O nome deve conter somente números e letras, sem caracteres especiais!");
            return
        }

        await postDados(nomeLoja, formatWhatsApp(whatsapp))
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
        <div className="w-[100%] h-[100%] flex justify-center bg-[#F9FAFB]">
            <div className="h-[750px] w-[869px] rounded-[16px] mt-[32px]">
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
                            className="font-medium border-none focus:outline-none dados pointer-events-none select-none"
                            readOnly
                            defaultValue={email || user?.email}
                        />
                    </div>
                    <div className="bg-[#FAF5FF] flex flex-col gap-[10px] p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="whatsapp.svg" alt="" />
                            <span className="text-[12px] text-[#6B7280]">Whatsapp</span>
                        </div>
                        <div>
                            <span className={"font-medium text-[#6B7280]"}>+55 </span>
                            <input
                                ref={whatsappRef}
                                type="text"
                                onChange={handleWhatsAppChange}
                                className={"font-medium border-none focus:outline-none dados " + isInterable}
                                defaultValue={whatsapp || formatWhatsAppFromAPI(user?.whatsapp || "")}
                            />
                        </div>
                    </div>
                    <button onClick={() => { setVisible(false); setInterable("bg-[#fff]") }} className={"bg-[#9333EA] font-medium hover:bg-[#7E22CE] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-[#fff] " + (isVisible ? "" : "hidden")}>Editar</button>
                    <div className={"flex mx-auto gap-[20px] " + (!isVisible ? "" : "hidden")}>
                        <button onClick={() => { setInterable("pointer-events-none select-none"); restaurarDados() }} className={"bg-[#CD5C5C] text-[#fff] font-medium hover:bg-[#B22222] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer "}>Cancelar</button>
                        <button onClick={() => { validarDados(); }} id="salvar" className="font-medium bg-green-600 text-[#fff] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer hover:bg-green-700 ">Salvar</button>
                    </div>
                </div>
            </div>
            {/* ✅ Container para toasts */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}