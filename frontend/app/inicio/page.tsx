"use client"

import { useRequireAuth } from "@/hooks/useAuth";

export default function InicioPage() {
    // Esta linha protege a rota. Redireciona para /login se não estiver autenticado.
    const { isLoading } = useRequireAuth();

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>Página Inicial</h1>
            <p>Conteúdo da sua vitrine aqui.</p>
        </div>
    );
}