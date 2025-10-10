"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { Codigo } from "@/hooks/useSenha";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function CodigoPage() {
    const { data, status, loading, errorMessage, getCodigo, resetState } = Codigo();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { toasts, showSuccess, showError, removeToast } = useToast();

    // Limpa o estado e localStorage ao montar a página
    useEffect(() => {
        resetState();
        localStorage.removeItem("codigo");
    }, []);

    // Efeito para redirecionar quando o código for validado com sucesso
    useEffect(() => {
        if (status === 200 && data) {
            console.log("Código validado com sucesso:", data);
            showSuccess("Código validado com sucesso!");
            localStorage.setItem("codigo", data)
            router.push("/esqueci-minha-senha-c");
        }
    }, [status, data, router]);

    // Efeito para mostrar erro quando houver mensagem de erro
    useEffect(() => {
        if (errorMessage) {
            showError(errorMessage);
            
            // Se o código expirou (410), sugerir voltar para solicitar novo código
            if (status === 410) {
                setTimeout(() => {
                    const voltar = confirm("O código expirou. Deseja voltar para solicitar um novo código?");
                    if (voltar) {
                        router.push("/esqueci-minha-senha-a");
                    }
                }, 2000);
            }
        }
    }, [errorMessage, status, router]);

    const handleVerificarCodigo = async () => {
        const codigo = inputRef.current?.value?.trim();
        
        if (!codigo) {
            return;
        }
        
        await getCodigo(codigo);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleVerificarCodigo();
        }
    };

    return (
        <div className="bg-[#F9FAFB] h-full flex flex-col justify-center items-center px-4">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            
            <div className="w-full max-w-[448px] text-[#111827]">
                <h1 className="text-[25.5px] sm:pl-8 mb-2">Código de Recuperação</h1>
                <p className="text-[#4B5563] sm:pl-14 pb-8 sm:pb-14">Digite o código recebido no seu email!</p>
                
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="border-2 border-[#D1D5DB] rounded-md overflow-hidden">
                            <Input 
                                ref={inputRef} 
                                type="text" 
                                placeholder="Código de Recuperação" 
                                className="w-full h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    
                    <Button 
                        type="button" 
                        onClick={handleVerificarCodigo} 
                        className="w-full h-[38px] bg-[#2563EB] text-white cursor-pointer hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Verificando..." : "Verificar Código"}
                    </Button>
                    
                    <Link href="/login" className="text-[#2563EB] text-center hover:underline">
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    )
}