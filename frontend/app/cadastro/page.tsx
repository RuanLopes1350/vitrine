"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRedirectIfAuthenticated } from "@/hooks/useAuth";


export default function CadastroPage() {
    useRedirectIfAuthenticated();

    const [nome, setNome] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const { cadastro } = useAuth();
    const router = useRouter();

    async function handleCadastro() {
        const whatsappRegex = /^\d+$/
        let erros = [];

        if (!email) {
            erros.push('Email é obrigatório!');
        }
        if (!senha) {
            erros.push('Senha é obrigatória!');
        }
        if (!nome) {
            erros.push('Nome é obrigatório!');
        }
        if (!nomeFantasia) {
            erros.push('Nome Fantasia é obrigatório!');
        }
        if (!whatsapp) {
            erros.push('WhatsApp é obrigatório!');
        }
        if (whatsapp && !whatsappRegex.test(whatsapp)) {
            erros.push('WhatsApp deve conter apenas números!');
        }

        setErrorMessage(erros)

        if (erros.length > 0) {
            setErrorMessage(erros);
            return;
        }

        setIsLoading(true);
        setErrorMessage([]);

        const result = await cadastro(nome, nomeFantasia, whatsapp, email, senha);

        if (result.success) {
            console.log('Cadastro realizado com sucesso!');
            setSuccess(true);
            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                router.push('/login');
            }, 2000);
            // Limpar formulário
            setNome('');
            setNomeFantasia('');
            setWhatsapp('');
            setEmail('');
            setSenha('');
        } else {
            setSuccess(false);
            // Combinar mensagem principal com erros detalhados
            const errorMessages = [result.message];
            if (result.errors && result.errors.length > 0) {
                result.errors.forEach(erro => {
                    errorMessages.push(erro.mensagem);
                });
            }
            setErrorMessage(errorMessages);
        }

        setIsLoading(false);
    }
    return (
        <div className="bg-[#F9FAFB] h-full flex flex-col justify-center items-center pb-50">
            <div className="w-[448px] h-[301px] text-[#111827]">
                <h1 className="text-[25.5px] pl-8">Crie sua conta Vitrine</h1>
                <p className="text-[#4B5563] pl-34 pb-14">Ou <Link href="/login" className="text-[#2563EB]">já possui uma conta? Fazer login</Link></p>
                <div className="flex flex-col gap-8">
                    <div className="border-2 border-[#D1D5DB] rounded-md gap-0 overflow-hidden">
                        <Input
                            type="text"
                            placeholder="Nome completo"
                            onChange={(e) => setNome(e.target.value)}
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Input
                            type="text"
                            placeholder="Nome Fantasia"
                            onChange={(e) => setNomeFantasia(e.target.value)}
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Input
                            type="text"
                            placeholder="WhatsApp Ex: 2199999999"
                            onChange={(e) => setWhatsapp(e.target.value)}
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0
                            [-moz-appearance:textfield] /* Para Firefox */ 
                            [&::-webkit-outer-spin-button]:appearance-none /* Para WebKit */ 
                            [&::-webkit-inner-spin-button]:appearance-none /* Para WebKit */" />
                        <Input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Input
                            type="password"
                            placeholder="Senha"
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    <Button
                        className="w-[448px] h-[38px] bg-[#2563EB] text-white cursor-pointer"
                        onClick={handleCadastro}
                        disabled={isLoading}>{isLoading ? 'Carregando...' : 'Cadastrar'}</Button>
                    {success === true ? (
                        <span className="text-green-600 text-sm">Cadastro realizado com sucesso! Redirecionando...</span>
                    ) : errorMessage.length > 0 && (
                        <div className="text-red-600 text-sm h-28 overflow-hidden">
                            {errorMessage.join(' • ')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}