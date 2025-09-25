"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

import apiClient from "@/apiClient";

interface LoginResponse {
    code: number,
    mensagem: string,
    data: {
        token: string,
        usuario: {
            id: string,
            nome: string,
            email: string,
        }
    }
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    async function handleLogin(email: string, senha: string) {
    try {
        const response = await apiClient.post('/login', { email, senha });
        
        // Sucesso - salvar dados do usuário no localStorage
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            
            console.log('Login realizado com sucesso!');
            // Redirecionar para dashboard/home
            // window.location.href = '/dashboard';
        }
    } catch (error) {
        console.error('Erro no login:', error);
        
        if (error.response) {
            // Erro da API (400, 401, etc)
            alert(error.response.data.message || 'Erro ao fazer login');
        } else {
            // Erro de rede
            alert('Erro de conexão. Verifique se o servidor está rodando.');
        }
    }
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
                    <Button className="w-[448px] h-[38px] bg-[#2563EB] text-white cursor-pointer" onClick={() => handleLogin(email, senha)}>Entrar</Button>
                </div>
            </div>
        </div>
    )
}