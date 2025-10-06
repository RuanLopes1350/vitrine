
"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/hooks/useAuth";
import apiClient from "@/apiClient";
import { useState, useRef, useEffect } from "react";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { useCloudinaryUpload } from "@/hooks/useCloudinary";
import { useTheme } from "@/contexts/ThemeContext";

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

    // Estados para upload de foto de perfil
    const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
    const [previewProfileUrl, setPreviewProfileUrl] = useState<string | null>(null);
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const { uploadImage } = useCloudinaryUpload();
    const { theme } = useTheme();

    // Hook que protege a rota - redireciona para login se não autenticado
    const { isAuthenticated, isLoading } = useRequireAuth();
    // Context de autenticação
    const { user, logout, updateUser } = useAuth();
    // Hook do toast para mensagens
    const { toasts, showSuccess, showError, removeToast } = useToast();

    // Função utilitária para mostrar erros da API
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

    // Função para quando usuário seleciona uma foto
    const handleProfileFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Verifica se é imagem
            if (!file.type.startsWith('image/')) {
                showError('Por favor, selecione apenas arquivos de imagem');
                return;
            }

            // Cria URL temporária para preview
            const preview = URL.createObjectURL(file);
            setSelectedProfileFile(file);
            setPreviewProfileUrl(preview);
        }
    };

    // Estados que ainda são necessários para o funcionamento do componente
    const [isVisible, setVisible] = useState<boolean>(true)
    const [isInterable, setInterable] = useState<string>("pointer-events-none select-none")
    const [nomeLoja, setNomeLoja] = useState<string>("")
    const [nome, setNome] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [whatsapp, setWhatsapp] = useState<string>("")
    const [desc, setDesc] = useState<string>("")

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
            setDesc(user.mensagem)
        }
    }, [user]);

    const nomeRefLoja = useRef<HTMLInputElement>(null)
    const whatsappRef = useRef<HTMLInputElement>(null)
    const descRef = useRef<HTMLTextAreaElement>(null)

    async function postDados(nomeLoja: string, whatsapp: string, descricao: string, fotoPerfil?: string) {
        try {
            const dados = {
                nomeLoja: nomeLoja,
                whatsapp: "55" + unformatWhatsApp(whatsapp),
                mensagem: descricao,
                ...(fotoPerfil && { fotoPerfil })

            }

            // Usar o apiClient que já tem o token configurado automaticamente
            const resposta = await apiClient.patch(`/usuarios/${user?.id}`, dados);

            if (resposta.status === 200) {
                if (nomeRefLoja.current?.value && whatsappRef.current?.value) {
                    nomeRefLoja.current.value = nomeLoja
                    whatsappRef.current.value = whatsapp
                }

                // Atualizar o user no contexto corretamente
                updateUser({
                    nomeLoja: nomeLoja,
                    whatsapp: "55" + unformatWhatsApp(whatsapp),
                    mensagem: descricao,
                    ...(fotoPerfil && { fotoPerfil })
                });

                // Atualizar estados locais
                setNomeLoja(nomeLoja)
                setWhatsapp(whatsapp) // sem prefixo para display
                setDesc(descricao)
                setVisible(true)
                setInterable("pointer-events-none select-none")

                // Toast de sucesso
                showSuccess("Dados salvos com sucesso!");
                return
            }

            // Toast de erro para falha na resposta
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
                    // Usar função utilitária para mostrar erro personalizado
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
                // Usar função utilitária para mostrar erro personalizado
                showApiError(erro, `Erro ao salvar alterações (${statusCode})`);

            } else {
                // Erro genérico (rede, etc.)
                restaurarDados();
                setInterable("pointer-events-none select-none");
                // Toast para erro de conexão
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
        if (descRef.current && user?.mensagem) {
            descRef.current.value = user.mensagem
        } else if (descRef.current) {
            descRef.current.value = ""
        }
        autoResize()
        setVisible(true)
    }
    async function validarDados() {

        const whatsappRegex = /^\d+$/
        const nomeRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9 ]+$/
        const nomeLoja = nomeRefLoja.current?.value.trim() as string
        const whatsapp = unformatWhatsApp(whatsappRef.current?.value.trim() as string)
        const desc = descRef.current?.value.trim() as string

        if (whatsapp?.length < 10 || whatsapp?.length > 11) {
            // Toast para erro de WhatsApp
            showError("O número de WhatsApp deve ter entre 10 e 11 dígitos! Exemplo: 99 9999-9999 ou 99 99999-9999");
            return
        }

        let fotoPerfilUrl = user?.fotoPerfil;

        if (selectedProfileFile) {
            setUploadingProfile(true);
            showSuccess('Fazendo upload da foto...');

            const uploadResult = await uploadImage(selectedProfileFile);

            setUploadingProfile(false);

            if (!uploadResult) {
                showError('Falha no upload da foto de perfil');
                return;
            }

            fotoPerfilUrl = uploadResult.secure_url;
            console.log('Foto enviada com sucesso:', fotoPerfilUrl);
        }

        if (!whatsappRegex.test(whatsapp)) {
            // Toast para erro de formato do WhatsApp
            showError("O WhatsApp deve conter somente números, sem espaços!");
            return
        }

        if (!nomeRegex.test(nomeLoja)) {
            // Toast para erro do nome da loja
            showError("O nome deve conter somente números e letras, sem caracteres especiais!");
            return
        }
        if (desc?.length > 500) {
            showError("A descrição não pode passar de 500 caracteres!")
            return
        }

        await postDados(nomeLoja, formatWhatsApp(whatsapp), desc, fotoPerfilUrl);

        // Limpar preview após salvar
        if (previewProfileUrl) {
            URL.revokeObjectURL(previewProfileUrl);
            setPreviewProfileUrl(null);
            setSelectedProfileFile(null);
        }
    }

    function autoResize() {
        if (descRef.current) {
            descRef.current.style.height = 'auto'
            descRef.current.style.height = descRef.current.scrollHeight + 'px'
        }
    }

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-[#F9FAFB] dark:bg-gray-900">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Carregando...</div>
                </div>
            </div>
        );
    }

    // Se não estiver autenticado, o hook já redirecionará
    if (!isAuthenticated) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-[#F9FAFB] dark:bg-gray-900">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-700 dark:text-gray-300">Redirecionando...</div>
                </div>
            </div>
        );
    }
    // bg-[#F9FAFB]
    return (
        <div className="w-full h-full  flex justify-center bg-[#F9FAFB] dark:bg-gray-900 px-4 py-4 sm:py-0">
            <div className="grow min-h-[750px] w-full max-w-[869px] rounded-[16px] mt-0 sm:mt-[32px] mb-[20px]">
                <div className="bg-gradient-to-r from-[#9333EA] to-[#4338CA] dark:from-purple-600 dark:to-purple-800 min-h-[120px] sm:h-[144px] w-full flex p-[16px] sm:p-[20px] items-center rounded-t-[16px]">
                    <div className="flex justify-center items-center gap-[12px] sm:gap-[20px] text-[#fff]">
                        <div className="relative shadow-md h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] rounded-full bg-[#fff] flex justify-center items-center text-[28px] sm:text-[36px] font-bold text-[#9333EA] overflow-hidden">
                            {(previewProfileUrl || user?.fotoPerfil) ? (
                                <img
                                    src={previewProfileUrl || user?.fotoPerfil}
                                    alt="Foto de perfil"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                nome ? nome[0].toUpperCase() : "U"
                            )}
                        </div>
                        <div>
                            <div className="text-[18px] sm:text-[20px] font-bold">{nome || user?.nome}</div>
                            <p className="text-sm sm:text-base">Gerencie o perfil da sua loja</p>
                        </div>
                    </div>
                </div>
                <div className="w-full bg-[#fff] dark:bg-gray-800 p-[16px] sm:p-[20px] gap-[16px] sm:gap-[20px] flex flex-col rounded-b-[16px]">
                    <div className="bg-[#FAF5FF] dark:bg-purple-900/30 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="empresa.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400">Nome da Empresa</span>
                        </div>
                        <input
                            ref={nomeRefLoja}
                            type="text"
                            className={"font-medium border-none focus:outline-none dados text-sm sm:text-base dark:bg-transparent dark:text-gray-100 " + isInterable}
                            defaultValue={nomeLoja || user?.nomeLoja}
                        />
                    </div>
                    <div className="bg-[#FAF5FF] dark:bg-purple-900/30 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="email.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400">E-mail</span>
                        </div>
                        <input
                            type="text"
                            className="font-medium border-none focus:outline-none dados pointer-events-none select-none text-sm sm:text-base dark:bg-transparent dark:text-gray-100"
                            readOnly
                            defaultValue={email || user?.email}
                        />
                    </div>
                    <div className="bg-[#FAF5FF] dark:bg-purple-900/30 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="whatsapp.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400">Whatsapp</span>
                        </div>
                        <div className="flex gap-[5px]">
                            <span className={"font-medium text-[#6B7280] dark:text-gray-400 text-sm sm:text-base"}>+55 </span>
                            <input
                                ref={whatsappRef}
                                type="text"
                                onChange={handleWhatsAppChange}
                                className={"w-[100%] font-medium border-none focus:outline-none dados text-sm sm:text-base dark:bg-transparent dark:text-gray-100 " + isInterable}
                                defaultValue={whatsapp || formatWhatsAppFromAPI(user?.whatsapp || "")}
                            />
                        </div>
                    </div>
                    <div className="bg-[#FAF5FF] dark:bg-purple-900/30 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="info.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400">Descrição da loja</span>
                        </div>
                        <div className="w-[100%]">
                            <textarea
                                onInput={autoResize}
                                name=""
                                id=""
                                ref={descRef}
                                className={"resize-none overflow-hidden w-[100%] font-medium border-none focus:outline-none dados text-sm sm:text-base dark:bg-transparent dark:text-gray-100 " + isInterable}
                                defaultValue={desc || user?.mensagem}
                            ></textarea>
                        </div>
                    </div>
                    {/* Seção de Foto de Perfil */}
                    <div className="bg-[#FAF5FF] dark:bg-purple-900/30 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="self.png" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-[#6B7280] dark:text-gray-400">Foto de Perfil</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-[12px]">
                            {/* Preview da foto */}
                            <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-r from-[#9333EA] to-[#4338CA] dark:from-purple-600 dark:to-purple-800 flex justify-center items-center overflow-hidden">
                                {(previewProfileUrl || user?.fotoPerfil) ? (
                                    <img
                                        src={previewProfileUrl || user?.fotoPerfil}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white text-2xl font-bold">
                                        {nome ? nome[0].toUpperCase() : "U"}
                                    </span>
                                )}
                            </div>

                            {/* Input de arquivo + botão */}
                            <div className="flex flex-col gap-[8px] flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileFileSelect}
                                    disabled={isInterable === "pointer-events-none select-none"}
                                    className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#9333EA] dark:file:bg-purple-600 file:text-white hover:file:bg-[#7E22CE] dark:hover:file:bg-purple-700 file:cursor-pointer disabled:opacity-50"
                                />
                                {selectedProfileFile && (
                                    <p className="text-xs text-[#6B7280] dark:text-gray-400">
                                        {selectedProfileFile.name} ({(selectedProfileFile.size / 1024).toFixed(2)} KB)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { setVisible(false); setInterable("bg-[#fff]") }} className={"bg-[#9333EA] dark:bg-purple-600 font-medium hover:bg-[#7E22CE] dark:hover:bg-purple-700 w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-[#fff] text-sm sm:text-base " + (isVisible ? "" : "hidden")}>Editar</button>
                    <div className={"flex mx-auto gap-[16px] sm:gap-[20px] " + (!isVisible ? "" : "hidden")}>
                        <button onClick={() => { setInterable("pointer-events-none select-none"); restaurarDados() }} className={"bg-[#CD5C5C] dark:bg-red-600 text-[#fff] font-medium hover:bg-[#B22222] dark:hover:bg-red-700 w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-sm sm:text-base "}>Cancelar</button>
                        <button onClick={() => { validarDados(); }} id="salvar" className="font-medium bg-green-600 dark:bg-green-700 text-[#fff] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer hover:bg-green-700 dark:hover:bg-green-800 text-sm sm:text-base ">Salvar</button>
                    </div>
                </div>
            </div>
            {/* Container para toasts */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}