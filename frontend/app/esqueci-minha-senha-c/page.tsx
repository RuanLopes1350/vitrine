"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { Codigo } from "@/hooks/useSenha";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CadastroPage() {
    const novaSenhaRef = useRef<HTMLInputElement>(null);
    const confirmaSenhaRef = useRef<HTMLInputElement>(null);
    const [erroLocal, setErroLocal] = useState<string>("");
    const [novaSenha, setNovaSenha] = useState<string>("");
    const [confirmaSenha, setConfirmaSenha] = useState<string>("");
    const router = useRouter();
    
    const { status, loading, errorMessage, successMessage, postSenha } = Codigo();
    const { toasts, showSuccess, showError, removeToast } = useToast();

    // Validação em tempo real
    useEffect(() => {
        // Limpa erro ao começar a digitar
        if (!novaSenha && !confirmaSenha) {
            setErroLocal("");
            return;
        }

        // Valida formato da senha
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (novaSenha && !senhaRegex.test(novaSenha)) {
            setErroLocal("A senha deve conter pelo menos 8 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@$!%*?&).");
            return;
        }

        // Valida se as senhas coincidem
        if (confirmaSenha && novaSenha !== confirmaSenha) {
            setErroLocal("As senhas não coincidem.");
            return;
        }

        // Se passou todas as validações, limpa erro
        if (novaSenha && confirmaSenha && novaSenha === confirmaSenha && senhaRegex.test(novaSenha)) {
            setErroLocal("");
        }
    }, [novaSenha, confirmaSenha]);

    // Verificar se tem código no localStorage
    useEffect(() => {
        const codigo = localStorage.getItem("codigo");
        if (!codigo) {
            showError("Código de recuperação não encontrado. Redirecionando...");
            setTimeout(() => {
                router.push("/esqueci-minha-senha-a");
            }, 2000);
        }
    }, [router]);

    // Efeito para mostrar toast de sucesso
    useEffect(() => {
        if (successMessage) {
            showSuccess(successMessage);
        }
    }, [successMessage]);

    // Efeito para mostrar toast de erro do backend
    useEffect(() => {
        if (errorMessage) {
            showError(errorMessage);
        }
    }, [errorMessage]);

    // Efeito para redirecionar quando senha for alterada com sucesso
    useEffect(() => {
        if (status === 200) {
            localStorage.removeItem("codigo");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        }
    }, [status, router]);

    const handleResetarSenha = async () => {
        // Validações locais
        if (!novaSenha || !confirmaSenha) {
            setErroLocal("Por favor, preencha todos os campos.");
            return;
        }

        // Valida formato da senha
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!senhaRegex.test(novaSenha)) {
            setErroLocal("A senha deve conter pelo menos 8 caracteres, incluindo: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@$!%*?&).");
            return;
        }
        
        if (novaSenha !== confirmaSenha) {
            setErroLocal("As senhas não coincidem.");
            return;
        }
        
        // Pega o código do localStorage
        const codigo = localStorage.getItem("codigo");
        if (!codigo) {
            showError("Código de recuperação não encontrado.");
            setTimeout(() => {
                router.push("/esqueci-minha-senha-a");
            }, 2000);
            return;
        }
        
        // Limpa erro local antes de enviar
        setErroLocal("");
        
        // Chama o método postSenha do hook
        await postSenha(novaSenha, codigo);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleResetarSenha();
        }
    };

    return (
        <div className="bg-[#F9FAFB] h-full flex flex-col justify-center items-center px-4">
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            
            <div className="w-full max-w-[448px] text-[#111827]">
                <h1 className="text-[25.5px] sm:pl-8 mb-2">Resetar sua senha</h1>
                <p className="text-[#4B5563] sm:pl-14 pb-8 sm:pb-14">Digite sua nova senha!</p>
                
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="border-2 border-[#D1D5DB] rounded-md overflow-hidden">
                            <Input
                                ref={novaSenhaRef}
                                type="password"
                                placeholder="Nova Senha"
                                value={novaSenha}
                                onChange={(e) => setNovaSenha(e.target.value)}
                                className="w-full h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-b"
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                            />
                            <Input
                                ref={confirmaSenhaRef}
                                type="password"
                                placeholder="Confirme a Senha"
                                value={confirmaSenha}
                                onChange={(e) => setConfirmaSenha(e.target.value)}
                                className="w-full h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 border-0"
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                            />
                        </div>
                        {erroLocal && (
                            <p className="text-red-500 text-sm mt-2">{erroLocal}</p>
                        )}
                    </div>
                    
                    <Button 
                        type="button"
                        onClick={handleResetarSenha}
                        className="w-full h-[38px] bg-[#2563EB] text-white cursor-pointer hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Resetando..." : "Resetar Senha"}
                    </Button>
                    
                    <Link href="/login" className="text-[#2563EB] text-center hover:underline">
                        Voltar ao login
                    </Link>
                </div>
            </div>
        </div>
    )
}