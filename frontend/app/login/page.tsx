"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRedirectIfAuthenticated } from '@/hooks/useAuth';

export default function LoginPage() {
    useRedirectIfAuthenticated();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const { login } = useAuth();
    const router = useRouter();

    async function handleLogin() {
        if (!email || !senha) {
            setErrorMessage('Email e senha são obrigatórios');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        
        const result = await login(email, senha);
        
        if (result.success) {
            console.log('Login realizado com sucesso!');
            router.push('/inicio');
        } else {
            setErrorMessage(result.message);
        }
        
        setIsLoading(false);
    }

    return (
        <div className="bg-[#F9FAFB] dark:bg-gray-900 h-full flex flex-col justify-center items-center px-4">
            <div className="w-full max-w-[448px] text-[#111827] dark:text-gray-100">
                <h1 className="text-[25.5px] sm:pl-8 pl-0">Faça login em sua conta</h1>
                <p className="text-[#4B5563] dark:text-gray-400 sm:pl-34 pl-0 pb-8 sm:pb-14">Ou <Link href="/cadastro" className="text-[#2563EB] dark:text-purple-400">crie uma nova conta</Link></p>
                <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="border-2 border-[#D1D5DB] dark:border-gray-600 rounded-md gap-0 overflow-hidden bg-white dark:bg-gray-800">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[38px] border-[#D1D5DB] dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full h-[38px] border-[#D1D5DB] dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Link href="/esqueci-minha-senha-a" className="text-[#2563EB] dark:text-purple-400">Esqueceu sua senha?</Link>
                    <Button 
                        className="w-full h-[38px] bg-[#2563EB] dark:bg-purple-600 text-white cursor-pointer hover:bg-[#1d4ed8] dark:hover:bg-purple-700" 
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                    {errorMessage && (
                        <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errorMessage}</p>
                    )}
                </div>
            </div>
        </div>
    )
}