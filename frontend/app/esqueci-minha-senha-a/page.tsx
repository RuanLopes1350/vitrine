"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { Codigo } from "@/hooks/useSenha";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LoginPage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { status, loading, errorMessage, successMessage, esqueceuSenha } = Codigo();
    const { toasts, showSuccess, showError, removeToast } = useToast();

    // Efeito para mostrar toast de sucesso
    useEffect(() => {
        if (successMessage) {
            showSuccess(successMessage);
        }
    }, [successMessage]);

    // Efeito para mostrar toast de erro
    useEffect(() => {
        if (errorMessage) {
            showError(errorMessage);
        }
    }, [errorMessage]);

    // Efeito para redirecionar quando email for enviado com sucesso
    useEffect(() => {
        if (status === 200) {
            setTimeout(() => {
                router.push("/esqueci-minha-senha-b");
            }, 2000); // Aguarda 2 segundos para usuário ver a mensagem de sucesso
        }
    }, [status, router]);

    const handleEnviarCodigo = async () => {
        const email = inputRef.current?.value?.trim();
        
        if (!email) {
            return;
        }
        
        await esqueceuSenha(email);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEnviarCodigo();
        }
    };

    return (
        <div className="bg-[#F9FAFB] h-full flex flex-col justify-center items-center px-4">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            
            <div className="w-full max-w-[448px] text-[#111827]">
                <h1 className="text-[25.5px] sm:pl-8 mb-2">Resetar sua senha</h1>
                <p className="text-[#4B5563] sm:pl-14 pb-8 sm:pb-14">Digite seu endereço de email para receber um código de recuperação!</p>
                
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="border-2 border-[#D1D5DB] rounded-md overflow-hidden">
                            <Input 
                                ref={inputRef}
                                type="email" 
                                placeholder="Email" 
                                className="w-full h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    <Button 
                        type="button"
                        onClick={handleEnviarCodigo}
                        className="w-full h-[38px] bg-[#2563EB] text-white cursor-pointer hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar Código de Recuperação"}
                    </Button>
                    
                    <Link href="/login" className="text-[#2563EB] text-center hover:underline">
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    )
}