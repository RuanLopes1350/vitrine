import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CadastroPage() {
    return (
        <div className="bg-[#F9FAFB] h-screen flex flex-col justify-center items-center pb-50">
            <div className="w-[448px] h-[301px] text-[#111827]">
                <h1 className="text-[25.5px] pl-8">Crie sua conta Vitrine</h1>
                <p className="text-[#4B5563] pl-34 pb-14">Ou <Link href="/login" className="text-[#2563EB]">já possui uma conta? Fazer login</Link></p>
                <div className="flex flex-col gap-8">
                    <div className="border-2 border-[#D1D5DB] rounded-md gap-0 overflow-hidden">
                        <Input
                            type="text"
                            placeholder="Nome completo"
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Input
                            type="text"
                            placeholder="Nome Fantasia"
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Input
                            type="number"
                            placeholder="WhatsApp Ex: 2199999999"
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0
                            [-moz-appearance:textfield] /* Para Firefox */ 
                            [&::-webkit-outer-spin-button]:appearance-none /* Para WebKit */ 
                            [&::-webkit-inner-spin-button]:appearance-none /* Para WebKit */" />
                        <Input
                            type="email"
                            placeholder="Email"
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                        <Input
                            type="password"
                            placeholder="Senha"
                            className="w-[448px] h-[38px] border-[#D1D5DB] rounded-none focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                    <Button className="w-[448px] h-[38px] bg-[#2563EB] text-white cursor-pointer">Cadastrar</Button>
                </div>
            </div>
        </div>
    )
}