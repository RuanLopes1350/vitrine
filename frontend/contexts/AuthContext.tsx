"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/apiClient';

// Tipos TypeScript
interface User {
    id: string;
    nome: string;
    nomeLoja: string;
    whatsapp: string;
    email: string;
    ativo: boolean;
}

interface LoginResponse {
    code: number;
    mensagem: string;
    data: {
        token: string;
        usuario: User;
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, senha: string) => Promise<{
        success: boolean;
        message: string;
        errors?: Array<{ campo?: string; mensagem: string }>; // ← ADICIONAR
    }>;
    cadastro: (nome: string, nomeLoja: string, whatsapp: string, email: string, senha: string) => Promise<{
        success: boolean;
        message: string;
        errors?: Array<{ campo?: string; mensagem: string }>; // ← ADICIONAR
    }>;
    logout: () => void;
}

// Criar o Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar se existe dados salvos no localStorage quando a app carrega
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    // Função de Login
    const login = async (email: string, senha: string) => {
        try {
            const response = await apiClient.post<LoginResponse>('/login', { email, senha });

            if (response.data.code === 200) {
                const { token: newToken, usuario } = response.data.data;

                // Salvar no estado
                setToken(newToken);
                setUser(usuario);

                // Salvar no localStorage
                localStorage.setItem('token', newToken);
                localStorage.setItem('user', JSON.stringify(usuario));

                return { success: true, message: response.data.mensagem };
            } else {
                return { 
                    success: false, 
                    message: response.data.mensagem,
                    errors: (response.data as any).erros || []
                };
            }
        } catch (error: any) {
            console.error('Erro no login:', error);

            if (error.response) {
                const errorData = error.response.data;
                return {
                    success: false,
                    message: errorData.mensagem || 'Erro ao fazer login',
                    errors: errorData.erros || []
                };
            } else {
                return { 
                    success: false, 
                    message: 'Erro de conexão. Verifique se o servidor está rodando.' 
                };
            }
        }
    };

    // Função de Logout
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isAuthenticated = !!user && !!token;

    const cadastro = async (nome: string, nomeLoja: string, whatsapp: string, email: string, senha: string) => {
        try {
            const response = await apiClient.post('/usuarios', { nome, nomeLoja, whatsapp, email, senha });

            const data = response.data as { code: number; mensagem?: string; erros?: any[] };
            if (data.code !== 200 && data.code !== 201) {
                return { 
                    success: false, 
                    message: data.mensagem || 'Erro ao cadastrar',
                    errors: data.erros || []
                };
            }

            return { success: true, message: data.mensagem || 'Cadastro realizado com sucesso' };
        } catch (error: any) {
            console.error('Erro no cadastro:', error);

            if (error.response) {
                const errorData = error.response.data;
                return { 
                    success: false, 
                    message: errorData.mensagem || 'Erro ao fazer cadastro',
                    errors: errorData.erros || []
                };
            } else {
                return { 
                    success: false, 
                    message: 'Erro de conexão. Verifique se o servidor está rodando.' 
                };
            }
        }
    }

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        cadastro,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizado para usar o AuthContext
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}