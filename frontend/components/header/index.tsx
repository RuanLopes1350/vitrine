"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const pathname = usePathname();
    const rotasParaOcultar = ["/login", "/cadastro", "/esqueci-minha-senha-a", "/esqueci-minha-senha-b", "/esqueci-minha-senha-c"];
    const { isAuthenticated, user, logout, isLoading } = useAuth();
    
    // Usar o nome da loja do usuário ou um padrão
    const nomeLojaExibir =  user?.nomeLoja || user?.nome;

    const handleLogout = () => {
        logout();
        // Opcional: redirecionar para login
        window.location.href = '/login';
    };

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <header className="h-[64px] bg-gradient-to-r from-[#9333EA] to-[#4338CA] flex justify-center items-center">
                <span className="text-white">Carregando...</span>
            </header>
        );
    }

    return (
        <header data-testid="header" className="h-[64px] bg-gradient-to-r from-[#9333EA] to-[#4338CA] flex justify-between items-center px-4">
            {/* Esquerda: Ícone + Nome */}
            <Link data-testid="header-link-logo" href="/inicio">
                <div className="flex flex-row items-center gap-2 pl-[102px]">
                    <img data-testid="header-icone-vitrine" src="/VitrineIcon.png" />
                    <span data-testid="header-titulo-vitrine" className="font-bold text-white">Vitrine</span>
                </div>
            </Link>
            {/* Direita: Ícones ou Links */}
            {isAuthenticated ? (
                <div className=" flex flex-row items-center gap-6 pr-20">
                    <Link data-testid="header-link-inicio" href="/inicio">
                        <img data-testid="header-icone-inicio" src="/home.png" />
                    </Link>
                    <Link data-testid="header-link-perfil" href="/perfil">
                        <img data-testid="header-icone-perfil" src="/self.png" />
                    </Link>
                    <img 
                        data-testid="header-icone-sair" 
                        src="/exit.png" 
                        onClick={handleLogout}
                        className="cursor-pointer hover:opacity-80"
                    />
                    <div data-testid="header-nome-loja" className="bg-[#6B21A8]/50 h-[28px] w-[125.35px] flex flex-row justify-center items-center gap-2 rounded-[24px]">
                        <p data-testid="header-texto-nome-loja" className="text-white font-bold">{nomeLojaExibir}</p>
                    </div>
                </div>
            ) : (!rotasParaOcultar.includes(pathname) && (
                <div className="pr-20">
                    <Link data-testid="header-link-login" href="/login" className="pr-8 text-white">Login</Link>
                    <Link data-testid="header-link-cadastro" href="/cadastro" className="text-[#7E22CE] bg-white rounded-[24px] h-[38px] w-[83.83px] p-3">Cadastrar</Link>
                </div>
            )
            )}
        </header>
    );
}
