import apiClient from "@/apiClient";
import { useState } from "react";

interface responseCodigo {
    code: number;
    mensagem: string;
    data?: string;
    erro?: boolean;
}

export function Codigo() {
    const [data, setData] = useState<string>("");
    const [status, setStatus] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    
    async function getCodigo(codigo: string) {
        if (!codigo || codigo.trim() === "") {
            console.warn("Código vazio fornecido");
            return;
        }

        setLoading(true);
        setStatus(undefined); // Reseta o status antes de fazer nova requisição
        
        try {
            const response = await apiClient.get<responseCodigo>(`/usuarios/senha/${codigo}`);
            
            if (response.status === 200) {
                setData(response.data.data || "");
                setStatus(response.status);
            }
        } catch (erro: any) {
            console.error("Erro ao buscar código:", erro);
            
            // Verifica se existe response antes de acessar status
            if (erro.response?.status === 404) {
                setStatus(404);
            } else if (erro.response?.status) {
                setStatus(erro.response.status);
            } else {
                // Erro de rede ou outro erro sem response
                setStatus(500);
            }
        } finally {
            setLoading(false);
        }
    }
    
    return {
        data,
        status,
        loading,
        getCodigo
    };
}