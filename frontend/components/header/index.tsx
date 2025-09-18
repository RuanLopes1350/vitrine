import Link from "next/link";

interface HeaderProps {
    nomePlataforma: string;
    label?: string;
}

export default function Header({ nomePlataforma, label }: HeaderProps) {
    const logado = false;

    return (
        <header className="h-[64px] bg-gradient-to-r from-[#9333EA] to-[#4338CA] flex justify-between items-center px-4">
            {/* Esquerda: Ícone + Nome */}
            <div className=" flex flex-row items-center gap-2">
                <img src="/VitrineIcon.png" />
                <span className="">{nomePlataforma}</span>
            </div>
            {/* Direita: Ícones ou Links */}
            {logado ? (
                <div className="">
                    {label && <span className="">{label}</span>}
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
