import Link from "next/link";

interface HeaderProps {
    nomeLoja: string;
    label?: string;
}

export default function Header({ nomeLoja, label }: HeaderProps) {
    const logado = false;
    nomeLoja = "Nome de loja";

    return (
        <header className="h-[64px] bg-gradient-to-r from-[#9333EA] to-[#4338CA] flex justify-between items-center px-4">
            {/* Esquerda: Ícone + Nome */}
            <Link href="/inicio">
                <div className="flex flex-row items-center gap-2 pl-[102px]">
                    <img src="/VitrineIcon.png" />
                    <span className="font-bold text-white">Vitrine</span>
                </div>
            </Link>
            {/* Direita: Ícones ou Links */}
            {logado ? (
                <div className=" flex flex-row items-center gap-6">
                    <Link href="/inicio"><img src="/home.png" /></Link>
                    <Link href="/perfil"><img src="/self.png" /></Link>
                    <img src="/exit.png" />
                    <div className="bg-[#6B21A8]/50 h-[28px] w-[125.35px] flex flex-row justify-center items-center gap-2 rounded-[24px]">
                        <p className="text-white font-bold">{nomeLoja}</p>
                    </div>
                </div>
            ) : (
                <div className="">
                    <Link href="/login" className="pr-8 text-white">Login</Link>
                    <Link href="/cadastro" className="text-[#7E22CE] bg-white rounded-[24px] h-[38px] w-[83.83px] p-3">Cadastrar</Link>
                </div>
            )}
        </header>
    );
}
