import Link from "next/link";

export default function PerfilPage() {
    return (
        <>
            <nav className="flex flex-row bg-[#ffffff] shadow-lg shadow-gray-400 p-4 gap-8">
                <h1 className="text-[#4F46E5]">Vitrine</h1>
                <ul className="flex flex-row gap-4">
                    <li><Link href="/inicio" className="text-[#374151]">Meus Produtos</Link></li>
                    <li><Link href="/meus-produtos" className="text-[#374151]">Gerenciar Produtos</Link></li>
                </ul>
            </nav>

            <div className="bg-[#F9FAFB] w-screen h-screen flex flex-col items-center p-8 gap-8">
                <main className="bg-[#FFFFFF] w-[448px] h-[542px] flex flex-col items-center p-8 gap-4 rounded-lg shadow-md">
                    <img src="/GawrGura.png" className="w-[96px] h-[96px] rounded-full overflow-hidden ring-2 ring-[#819fdb]" />
                    <label htmlFor="nome" className="text-[#374151]">Nome</label>
                    <input type="text" id="nome" placeholder={'Nome do Usuário'} className="placeholder:text-[#000000]" />
                    <label htmlFor="email" className="text-[#374151]">E-mail</label>
                    <input type="text" id="email" placeholder={'E-mail'} className="placeholder:text-[#000000]" />
                    <label htmlFor="whatsapp" className="text-[#374151]">WhatsApp</label>
                    <input type="text" id="whatsapp" placeholder={'WhatsApp'} className="placeholder:text-[#000000]" />
                </main>
            </div>
        </>
    )
}