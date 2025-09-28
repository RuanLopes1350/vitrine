"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
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
            router.push('/inicio'); // Redirecionar para a página inicial
        } else {
            setErrorMessage(result.message);
        }
        
        setIsLoading(false);
    }

    return (
        <div className="bg-[#F9FAFB] h-screen flex flex-col justify-center items-center">
            <div className="w-[448px] h-[301px] text-[#111827]">
                <h1 className="text-[25.5px] pl-8">Faça login em sua conta</h1>
                <p className="text-[#4B5563] pl-34 pb-14">Ou <Link href="/cadastro" className="text-[#2563EB]">crie uma nova conta</Link></p>
                <div className="flex flex-col gap-8">
                    <div className="border-2 border-[#D1D5DB] rounded-md gap-0 overflow-hidden">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <Link href="/esqueci-minha-senha-a" className="text-[#2563EB]">Esqueceu sua senha?</Link>
                    <Button 
                        className="w-[448px] h-[38px] bg-[#2563EB] text-white cursor-pointer" 
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}
                </div>
            </div>
        </div>
    )
}