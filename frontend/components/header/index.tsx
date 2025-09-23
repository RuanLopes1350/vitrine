"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
    nomeLoja: string;
    label?: string;
}

export default function Header({ nomeLoja, label }: HeaderProps) {
    const pathname = usePathname();
    const rotasParaOcultar = ["/login", "/cadastro", "/esqueci-minha-senha-a", "/esqueci-minha-senha-b", "/esqueci-minha-senha-c"];
    const logado = false;
    nomeLoja = "Nome de loja";

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
            {logado ? (
                <div className=" flex flex-row items-center gap-6 pr-20">
                    <Link data-testid="header-link-inicio" href="/inicio"><img data-testid="header-icone-inicio" src="/home.png" /></Link>
                    <Link data-testid="header-link-perfil" href="/perfil"><img data-testid="header-icone-perfil" src="/self.png" /></Link>
                    <img data-testid="header-icone-sair" src="/exit.png" />
                    <div data-testid="header-nome-loja" className="bg-[#6B21A8]/50 h-[28px] w-[125.35px] flex flex-row justify-center items-center gap-2 rounded-[24px]">
                        <p data-testid="header-texto-nome-loja" className="text-white font-bold">{nomeLoja}</p>
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
