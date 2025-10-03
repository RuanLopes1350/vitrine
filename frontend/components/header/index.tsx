"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
    const pathname = usePathname();
    // A lógica para ocultar os botões de login/cadastro nas próprias páginas de auth
    const rotasParaOcultarBotoes = ["/login", "/cadastro", "/esqueci-minha-senha-a", "/esqueci-minha-senha-b", "/esqueci-minha-senha-c"];
    const { isAuthenticated, user, logout, isLoading } = useAuth();
    
    const nomeLojaExibir =  user?.nomeLoja || user?.nome;

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    if (isLoading) {
        return (
            <header className="h-[64px] bg-gradient-to-r from-[#9333EA] to-[#4338CA] flex justify-center items-center flex-shrink-0">
                <span className="text-white">Carregando...</span>
            </header>
        );
    }

    return (
        <header data-testid="header" className="h-[64px] bg-gradient-to-r from-[#9333EA] to-[#4338CA] flex justify-between items-center px-4 sm:px-8 flex-shrink-0">
            <Link data-testid="header-link-logo" href="/inicio">
                <div className="flex flex-row items-center gap-2 sm:gap-3 sm:pl-[102px] pl-0">
                    <img 
                        data-testid="header-icone-vitrine" 
                        src="/VitrineIcon.png" 
                        alt="Vitrine Icon"
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    />
                    <span data-testid="header-titulo-vitrine" className="font-bold text-white text-base sm:text-lg">Vitrine</span>
                </div>
            </Link>
            
            {isAuthenticated ? (
                <div className="flex flex-row items-center gap-3 sm:gap-6 sm:pr-20 pr-0">
                    <Link data-testid="header-link-inicio" href="/inicio">
                        <img data-testid="header-icone-inicio" src="/home.png" className="w-6 h-6 sm:w-auto sm:h-auto" />
                    </Link>
                    <Link data-testid="header-link-perfil" href="/perfil">
                        <img data-testid="header-icone-perfil" src="/self.png" className="w-6 h-6 sm:w-auto sm:h-auto" />
                    </Link>
                    <img 
                        data-testid="header-icone-sair" 
                        src="/exit.png" 
                        onClick={handleLogout}
                        className="cursor-pointer hover:opacity-80 w-6 h-6 sm:w-auto sm:h-auto"
                    />
                    <div data-testid="header-nome-loja" className="hidden sm:flex bg-[#6B21A8]/50 h-[28px] min-w-[125px] px-3 flex-row justify-center items-center gap-2 rounded-[24px]">
                        <p data-testid="header-texto-nome-loja" className="text-white font-bold text-sm truncate">{nomeLojaExibir}</p>
                    </div>
                </div>
            ) : (!rotasParaOcultarBotoes.includes(pathname) && (
                <div className="flex gap-3 sm:gap-0 sm:pr-20 pr-0">
                    <Link data-testid="header-link-login" href="/login" className="sm:pr-8 pr-0 text-white text-sm sm:text-base">Login</Link>
                    <Link data-testid="header-link-cadastro" href="/cadastro" className="text-[#7E22CE] bg-white rounded-[24px] h-[32px] sm:h-[38px] px-3 sm:px-4 flex items-center justify-center text-sm sm:text-base">Cadastrar</Link>
                </div>
            )
            )}
        </header>
    );
}