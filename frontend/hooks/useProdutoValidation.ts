import { useState } from 'react';
import apiClient from '@/apiClient';
import { handleApiError } from '@/lib/errorHandling';

interface ValidationResponse {
    success: boolean;
    code: number;
    message?: string;
}

interface UseProdutoValidation {
    validarProduto: (produto: {
        nome_produto: string;
        descricao: string;
        preco: number;
        mensagem: string;
        ativo: boolean;
    }) => Promise<{ success: boolean; message: string }>;
    validating: boolean;
}

export function useProdutoValidation(): UseProdutoValidation {
    const [validating, setValidating] = useState(false);

    const validarProduto = async (produto: {
        nome_produto: string;
        descricao: string;
        preco: number;
        mensagem: string;
        ativo: boolean;
    }) => {
        try {
            setValidating(true);

            const response = await apiClient.post<ValidationResponse>('/produtos/validate', produto);

            if (response.data.code === 200) {
                return { success: true, message: 'Dados válidos' };
            } else {
                throw new Error(response.data.message || 'Erro na validação');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Erro na validação';
            return { success: false, message: errorMessage };
        } finally {
            setValidating(false);
        }
    };

    return { validarProduto, validating };
}