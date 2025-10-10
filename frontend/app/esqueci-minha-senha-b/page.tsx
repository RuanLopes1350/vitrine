"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Codigo } from "@/hooks/useSenha";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CodigoPage() {
    const { data, status, getCodigo } = Codigo();
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [erro, setErro] = useState<string>("");
    const [carregando, setCarregando] = useState<boolean>(false);

    // Efeito para redirecionar quando o código for validado com sucesso
    useEffect(() => {
        if (status === 200 && data) {
            console.log("Código validado com sucesso:", data);
            router.push("/esqueci-minha-senha-c");
        }
    }, [status, data, router]);

    // Efeito para exibir mensagem de erro
    useEffect(() => {
        if (status === 404) {
            setErro("Código de recuperação não encontrado ou inválido!");
            setCarregando(false);
        } else if (status === 200) {
            setErro("");
        }
    }, [status]);

    const handleVerificarCodigo = async () => {
        const codigo = inputRef.current?.value?.trim();
        
        // Validação do input
        if (!codigo) {
            setErro("Por favor, digite o código de recuperação.");
            return;
        }

        setErro("");
        setCarregando(true);
        
        try {
            await getCodigo(codigo);
        } catch (error) {
            console.error("Erro ao verificar código:", error);
            setErro("Erro ao verificar código. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleVerificarCodigo();
        }
    };

    return (
        <div className="bg-[#F9FAFB] h-full flex flex-col justify-center items-center px-4">
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
                                disabled={carregando}
                            />
                        </div>
                        {erro && (
                            <p className="text-red-500 text-sm mt-2">{erro}</p>
                        )}
                    </div>
                    
                    <Button 
                        type="button" 
                        onClick={handleVerificarCodigo} 
                        className="w-full h-[38px] bg-[#2563EB] text-white cursor-pointer hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={carregando}
                    >
                        {carregando ? "Verificando..." : "Verificar Código"}
                    </Button>
                    
                    <Link href="/login" className="text-[#2563EB] text-center hover:underline">
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    )
}