import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CadastroPage() {
    return (
        <div className="bg-[#F9FAFB] h-full flex flex-col justify-center items-center">
            <div className="w-[448px] h-[301px] text-[#111827]">
                <h1 className="text-[25.5px] pl-8">Resetar sua senha</h1>
                <p className="text-[#4B5563] pl-14 pb-14">Digite sua nova senha!</p>
                <div className="flex flex-col gap-8">
                    <div className="border-2 border-[#D1D5DB] rounded-md gap-0 overflow-hidden">
                        <Input
                            type="password"
                            placeholder="Nova Senha"
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Input
                            type="password"
                            placeholder="Confirme a Senha"
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    <Button className="w-[448px] h-[38px] bg-[#2563EB] text-white cursor-pointer">Resetar Senha</Button>
                    <Link href="/login" className="text-[#2563EB] translate-x-41">Voltar ao login</Link>
                </div>
            </div>
        </div>
    )
}