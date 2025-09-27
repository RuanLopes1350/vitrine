"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/apiClient';

// Tipos TypeScript
interface User {
    id: string;
    nome: string;
    email: string;
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
    login: (email: string, senha: string) => Promise<{ success: boolean; message: string }>;
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
            console.log('Enviando para API:', { email, senha });
            const response = await apiClient.post<LoginResponse>('/login', { email, senha });
            console.log('Resposta da API:', response.data);

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
                return { success: false, message: response.data.mensagem };
            }
        } catch (error: any) {
            console.error('Erro no login:', error);

            if (error.response) {
                return { success: false, message: error.response.data.mensagem || 'Erro ao fazer login' };
            } else {
                return { success: false, message: 'Erro de conexão. Verifique se o servidor está rodando.' };
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

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
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