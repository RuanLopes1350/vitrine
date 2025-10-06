
"use client"

import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/hooks/useAuth";
import apiClient from "@/apiClient";
import { useState, useRef, useEffect } from "react";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { useCloudinaryUpload } from "@/hooks/useCloudinary";

interface ErrorResponse {
    response?: {
        data?: {
            erro?: boolean,
            code?: number,
            mensagem?: string,
            erros?: {
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
    const [isInterable, setInterable] = useState<string>("pointer-events-none select-none bg-transparent")
    const [nomeLoja, setNomeLoja] = useState<string>("")
    const [nome, setNome] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [whatsapp, setWhatsapp] = useState<string>("")
    const [desc, setDesc] = useState<string>("")

    // ✅ ADICIONAR: Estados para upload de foto
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [removingPhoto, setRemovingPhoto] = useState(false);
    
    // ✅ ADICIONAR: Hook do Cloudinary
    const { uploadImage, uploading, error: uploadError } = useCloudinaryUpload();

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

    // ✅ ADICIONAR: Função para lidar com seleção de arquivo
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar tipo de arquivo
            if (!file.type.startsWith('image/')) {
                showError('Por favor, selecione apenas arquivos de imagem');
                return;
            }
            
            // Validar tamanho (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('Arquivo muito grande. Máximo 5MB');
                return;
            }
            
            setSelectedFile(file);
            
            // Criar preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ ADICIONAR: Função para remover foto selecionada
    const handleRemovePhoto = () => {
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    };

    // ✅ ADICIONAR: Função para excluir foto de perfil definitivamente
    const handleDeletePhoto = async () => {
        if (!user?.fotoPerfil && !previewUrl) return;

        try {
            setRemovingPhoto(true);
            showSuccess('Removendo foto de perfil...');

            // Usar postDados com fotoPerfil vazia para excluir
            const nomeLoja = user?.nomeLoja || "";
            const whatsappFormatted = user?.whatsapp ? 
                formatWhatsAppFromAPI(user.whatsapp) : "";
            const descricao = user?.mensagem || "";

            // ✅ Chamar postDados com fotoPerfil null para excluir
            await postDados(nomeLoja, whatsappFormatted, descricao, null);
            
            // Limpar preview local também
            setSelectedFile(null);
            setPreviewUrl(null);

            showSuccess('Foto de perfil removida com sucesso!');

        } catch (erro: unknown) {
            showApiError(erro as ErrorResponse, "Erro ao remover foto de perfil");
        } finally {
            setRemovingPhoto(false);
        }
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

    async function postDados(nomeLoja: string, whatsapp: string, descricao: string, fotoPerfilOverride?: string | null) {
        try {
            // Só definir uploadingPhoto se realmente vai fazer upload (não é remoção)
            const isRemoving = fotoPerfilOverride === null;
            if (!isRemoving) {
                setUploadingPhoto(true);
            }
            
            let fotoPerfilUrl = fotoPerfilOverride !== undefined ? fotoPerfilOverride : user?.fotoPerfil; // URL atual ou override

            // Se há uma nova foto selecionada, fazer upload (apenas se não há override)
            if (selectedFile && fotoPerfilOverride === undefined) {
                showSuccess('Fazendo upload da foto...');
                
                const uploadResult = await uploadImage(selectedFile);
                
                if (!uploadResult) {
                    showError('Falha no upload da foto de perfil');
                    setUploadingPhoto(false);
                    return;
                }
                
                fotoPerfilUrl = uploadResult.secure_url;
                showSuccess('Foto enviada com sucesso!');
            }

            const dados = {
                nomeLoja: nomeLoja,
                whatsapp: "55" + unformatWhatsApp(whatsapp),
                mensagem: descricao,
                fotoPerfil: fotoPerfilUrl // ✅ Incluir URL da foto
            }

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
                    whatsapp: "55" + unformatWhatsApp(whatsapp), // com prefixo para manter consistência no contexto
                    mensagem: descricao,
                    fotoPerfil: fotoPerfilUrl || undefined // ✅ Converter null para undefined
                });

                // Limpar states de upload
                setSelectedFile(null);
                setPreviewUrl(null);

                // Atualizar estados locais
                setNomeLoja(nomeLoja)
                setWhatsapp(whatsapp) // sem prefixo para display
                setDesc(descricao)
                setVisible(true)
                setInterable("pointer-events-none select-none bg-transparent")

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
                    setInterable("pointer-events-none select-none bg-transparent");
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
                setInterable("pointer-events-none select-none bg-transparent");
                // ✅ Usar função utilitária para mostrar erro personalizado
                showApiError(erro, `Erro ao salvar alterações (${statusCode})`);

            } else {
                // Erro genérico (rede, etc.)
                restaurarDados();
                setInterable("pointer-events-none select-none bg-transparent");
                // ✅ Toast para erro de conexão
                showError("Erro de conexão. Verifique sua internet e tente novamente.");
            }
        } finally {
            setUploadingPhoto(false);
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
        if(descRef.current && user?.mensagem){
           descRef.current.value = user.mensagem 
        } else if(descRef.current){
            descRef.current.value = ""
        }
        
        // ✅ ADICIONAR: Restaurar estado da foto
        setSelectedFile(null);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
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
        if(desc?.length > 500){
            showError("A descrição não pode passar de 500 caracteres!")
            return
        }

        await postDados(nomeLoja, formatWhatsApp(whatsapp), desc)
    }
    function autoResize(){
        if(descRef.current){
            descRef.current.style.height = 'auto'
            descRef.current.style.height= descRef.current.scrollHeight + 'px'
        }
    }

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-[#1F2937]">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-300">Carregando...</div>
                </div>
            </div>
        );
    }

    // Se não estiver autenticado, o hook já redirecionará
    if (!isAuthenticated) {
        return (
            <div className="w-full h-full flex justify-center items-center bg-[#1F2937]">
                <div className="text-center">
                    <div className="text-lg font-medium text-gray-300">Redirecionando...</div>
                </div>
            </div>
        );
    }
// bg-[#F9FAFB]
    return (
        <div className="w-full h-full flex justify-center bg-[#F9FAFB] dark:bg-gray-900 px-4 py-4 sm:py-0">
            <div className="grow min-h-[750px] w-full max-w-[869px] rounded-[16px] mt-0 sm:mt-[32px] mb-[20px]">
                <div className="bg-gradient-to-r from-[#9333EA] to-[#4338CA] min-h-[120px] sm:h-[144px] w-full flex p-[16px] sm:p-[20px] items-center rounded-t-[16px]">
                    <div className="flex justify-center items-center gap-[12px] sm:gap-[20px] text-[#fff]">
                        <div className="relative">
                            {/* ✅ ADICIONAR: Preview da foto de perfil */}
                            <div className="relative h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] bg-white rounded-full flex justify-center items-center ring-2 sm:ring-4 ring-white ring-opacity-20 overflow-hidden">
                                {previewUrl ? (
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview foto perfil"
                                        className="w-full h-full object-cover"
                                    />
                                ) : user?.fotoPerfil ? (
                                    <img 
                                        src={user.fotoPerfil} 
                                        alt="Foto perfil atual"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-[28px] sm:text-[36px] font-bold text-[#9333EA]">
                                        {nome ? nome[0].toUpperCase() : "U"}
                                    </span>
                                )}
                            </div>
                            
                            {/* ✅ MODIFICAR: Botão para alterar foto (só no modo de edição) */}
                            {!isVisible && (
                                <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                        <div>
                            <div className="text-[18px] sm:text-[20px] font-bold">{nome || user?.nome}</div>
                            <p className="text-sm sm:text-base">Gerencie o perfil da sua loja</p>
                        </div>
                    </div>
                </div>

                {/* ✅ MODIFICAR: Seção de preview da foto (só no modo de edição) */}
                {!isVisible && selectedFile && (
                    <div className="bg-gray-700 border-l-4 border-gray-500 p-4 m-4 rounded">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-500 flex items-center justify-center">
                                            <span className="text-gray-300 text-xs">IMG</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">Nova foto selecionada</p>
                                    <p className="text-sm text-gray-300">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemovePhoto}
                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                )}

                {/* ✅ MODIFICAR: Botão para excluir foto de perfil (só no modo de edição e se há foto) */}
                {!isVisible && (user?.fotoPerfil || previewUrl) && (
                    <div className="flex justify-center py-4">
                        <button
                            onClick={handleDeletePhoto}
                            disabled={uploadingPhoto || uploading || removingPhoto}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>
                                {removingPhoto ? 'Removendo...' : 'Remover foto de perfil'}
                            </span>
                        </button>
                    </div>
                )}

                <div className="w-full bg-gray-800 p-[16px] sm:p-[20px] gap-[16px] sm:gap-[20px] flex flex-col rounded-b-[16px]">
                    <div className="bg-gray-700 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="empresa.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-gray-300">Nome da Empresa</span>
                        </div>
                        <input
                            ref={nomeRefLoja}
                            type="text"
                            className={"font-medium border-none focus:outline-none dados text-sm sm:text-base text-white placeholder-gray-400 px-2 py-1 rounded " + isInterable}
                            defaultValue={nomeLoja || user?.nomeLoja}
                        />
                    </div>
                    <div className="bg-gray-700 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="email.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-gray-300">E-mail</span>
                        </div>
                        <input
                            type="text"
                            className="font-medium border-none focus:outline-none dados pointer-events-none select-none text-sm sm:text-base bg-transparent text-gray-300"
                            readOnly
                            defaultValue={email || user?.email}
                        />
                    </div>
                    <div className="bg-gray-700 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="whatsapp.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-gray-300">Whatsapp</span>
                        </div>
                        <div className="flex gap-[5px]">
                            <span className={"font-medium text-gray-300 text-sm sm:text-base"}>+55 </span>
                            <input
                                ref={whatsappRef}
                                type="text"
                                onChange={handleWhatsAppChange}
                                className={"w-[100%] font-medium border-none focus:outline-none dados text-sm sm:text-base text-white placeholder-gray-400 px-2 py-1 rounded " + isInterable}
                                defaultValue={whatsapp || formatWhatsAppFromAPI(user?.whatsapp || "")}
                            />
                        </div>
                    </div>
                    <div className="bg-gray-700 flex flex-col gap-[10px] p-[16px] sm:p-[20px] rounded-[12px]">
                        <div className="flex gap-[10px] items-center">
                            <img src="info.svg" alt="" className="w-5 h-5 sm:w-auto sm:h-auto" />
                            <span className="text-[12px] text-gray-300">Descrição da loja</span>
                        </div>
                        <div className="w-[100%]">
                            <textarea
                            onInput={autoResize} 
                            name="" 
                            id=""
                            ref={descRef}
                            className={"resize-none overflow-hidden w-[100%] font-medium border-none focus:outline-none dados text-sm sm:text-base text-white placeholder-gray-400 px-2 py-1 rounded " + isInterable}
                            defaultValue={desc || user?.mensagem}
                            ></textarea>
                        </div>
                    </div>
                    <button onClick={() => { setVisible(false); setInterable("bg-gray-600") }} className={"bg-[#9333EA] font-medium hover:bg-[#7C3AED] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-[#fff] text-sm sm:text-base " + (isVisible ? "" : "hidden")}>Editar</button>
                    <div className={"flex mx-auto gap-[16px] sm:gap-[20px] " + (!isVisible ? "" : "hidden")}>
                        <button onClick={() => { setInterable("pointer-events-none select-none bg-transparent"); restaurarDados() }} className={"bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-sm sm:text-base "}>Cancelar</button>
                        <button 
                            onClick={() => { validarDados(); }} 
                            disabled={uploadingPhoto || uploading || removingPhoto}
                            className="font-medium bg-[#9333EA] hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed text-[#fff] w-[100px] mx-auto rounded-lg p-[10px] cursor-pointer text-sm sm:text-base flex items-center justify-center"
                        >
                            {(uploadingPhoto || uploading) ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Salvando...</span>
                                </>
                            ) : (
                                <span>Salvar</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {/* Container para toasts */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </div>
    );
}