import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="bg-[#F9FAFB] h-screen flex flex-col">
            <div className="border-2 w-[448px] h-[301px] text-[#111827]">
                <h1>Faça login em sua conta</h1>
                <p className="text-[#4B5563]">Ou <Link href="/cadastro" className="text-[#2563EB]">crie uma nova conta</Link></p>
                <Input type="email" placeholder="Email" />
                <Input type="password" placeholder="Senha" />
                <Link href="/esqueci-minha-senha-a" className="text-[#2563EB]">Esqueceu sua senha?</Link>
            </div>
        </div>
    )
}