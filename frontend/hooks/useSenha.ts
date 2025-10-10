import apiClient from "@/apiClient";
import { useState } from "react";

interface responseCodigo {
    code: number;
    mensagem: string;
    data?: string;
    erro?: boolean;
        erros?: string[] | {
        campo: string;
        mensagem: string;
    }[];
}

export function Codigo() {
    const [data, setData] = useState<string>("");
    const [status, setStatus] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    
    async function getCodigo(codigo: string) {
        if (!codigo || codigo.trim() === "") {
            console.warn("Código vazio fornecido");
            setErrorMessage("Por favor, digite o código de recuperação.");
            return;
        }

        // Limpa TODOS os estados antes de fazer nova requisição
        setLoading(true);
        setData("");
        setStatus(undefined);
        setErrorMessage("");
        setSuccessMessage("");
        
        try {
            const response = await apiClient.get<responseCodigo>(`/usuarios/senha/${codigo}`);
            
            if (response.status === 200) {
                setData(response.data.data || "");
                setStatus(response.status);
                setErrorMessage("");
            }
        } catch (erro: any) {
            console.error("Erro ao buscar código:", erro);
            
            const data = erro.response?.data as responseCodigo | undefined;
            const statusCode = erro.response?.status;
            
            // Define o status
            setStatus(statusCode || 500);
            
            // Extrai a mensagem de erro dinâmica
            let mensagem = "Erro ao verificar código. Tente novamente.";
            
            if (data?.mensagem) {
                mensagem = data.mensagem;
            } else if (data?.code === 422 && Array.isArray(data.erros) && data.erros.length > 0) {
                const primeiroErro = data.erros[0];
                
                if (typeof primeiroErro === 'string') {
                    mensagem = primeiroErro;
                } else {
                    mensagem = `${primeiroErro.campo}: ${primeiroErro.mensagem}`;
                }
            } else if (statusCode === 404) {
                mensagem = data?.mensagem || "Código de recuperação não encontrado ou inválido.";
            } else if (statusCode === 410) {
                mensagem = data?.mensagem || "Tempo do código expirado, por favor peça um novo.";
            }
            
            setErrorMessage(mensagem);
        } finally {
            setLoading(false);
        }
    }
    async function postSenha(senha: string, codigo: string) {
        if (!senha || senha.trim() === "") {
            setErrorMessage("Por favor, digite a nova senha.");
            return false;
        }

        if (!codigo || codigo.trim() === "") {
            setErrorMessage("Código de recuperação é obrigatório.");
            return false;
        }

        // Validação de senha com regex
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!senhaRegex.test(senha)) {
            setErrorMessage("A senha deve conter pelo menos 8 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@$!%*?&).");
            return false;
        }

        setLoading(true);
        setStatus(undefined);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await apiClient.post<responseCodigo>('/password/reset', { senha, codigo });
            
            if (response.status === 200) {
                setStatus(response.status);
                setErrorMessage("");
                setSuccessMessage(response.data.mensagem || "Senha alterada com sucesso!");
                return true;
            }
        } catch (erro: any) {
            console.error("Erro ao trocar senha:", erro);
            
            const data = erro.response?.data as responseCodigo | undefined;
            const statusCode = erro.response?.status;
            
            setStatus(statusCode || 500);
            
            let mensagem = "Erro ao trocar senha. Tente novamente.";
            
            // Tratamento para erro 400 - validação de senha
            if (data?.code === 400 && Array.isArray(data.erros) && data.erros.length > 0) {
                const primeiroErro = data.erros[0];
                
                if (typeof primeiroErro === 'string') {
                    mensagem = primeiroErro;
                } else {
                    mensagem = primeiroErro.mensagem;
                }
            }
            // Tratamento para erro 500 - código não encontrado
            else if (data?.code === 500 && Array.isArray(data.erros)) {
                mensagem = data.mensagem || "Código de recuperação não encontrado ou inválido.";
            }
            // Outros erros
            else if (data?.mensagem) {
                mensagem = data.mensagem;
            }
            
            setErrorMessage(mensagem);
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    async function esqueceuSenha(email: string) {
        if (!email || email.trim() === "") {
            setErrorMessage("Por favor, digite o e-mail.");
            setSuccessMessage("");
            return false;
        }

        setLoading(true);
        setStatus(undefined);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await apiClient.post<responseCodigo>('/recover', { email });
            
            if (response.status === 200) {
                setStatus(response.status);
                setErrorMessage("");
                setSuccessMessage(response.data.mensagem || "Email enviado com sucesso!");
                return true;
            }
        } catch (erro: any) {
            console.error("Erro ao enviar código de recuperação:", erro);
            
            const data = erro.response?.data as responseCodigo | undefined;
            const statusCode = erro.response?.status;
            
            setStatus(statusCode || 500);
            setSuccessMessage("");
            
            let mensagem = "Erro ao enviar código de recuperação. Tente novamente.";
            
            // Tratamento para erro 400 - formato de email inválido
            if (data?.code === 400 && Array.isArray(data.erros) && data.erros.length > 0) {
                const primeiroErro = data.erros[0];
                
                if (typeof primeiroErro === 'string') {
                    mensagem = primeiroErro;
                } else {
                    mensagem = primeiroErro.mensagem;
                }
            }
            // Outros erros - usa mensagem do backend
            else if (data?.mensagem) {
                mensagem = data.mensagem;
            }
            
            setErrorMessage(mensagem);
            return false;
        } finally {
            setLoading(false);
        }
    }
    
    // Função para resetar todos os estados
    function resetState() {
        setData("");
        setStatus(undefined);
        setLoading(false);
        setErrorMessage("");
        setSuccessMessage("");
    }
    
    return {
        data,
        status,
        loading,
        errorMessage,
        successMessage,
        getCodigo,
        postSenha,
        esqueceuSenha,
        resetState
    };
}