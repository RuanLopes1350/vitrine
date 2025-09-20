"use client"

import Modal from "@/components/modal"

export default function TestesPage() {
    return (
        <div>
            <Modal
                titulo="Adicionar Um Novo Produto"
                button1={{
                    texto: "Cancelar",
                    className: "bg-blue-500 text-white",
                    action: () => console.log("Ação do botão 1")
                }}
                button2={{
                    texto: "Salvar",
                    className: "bg-gray-500 text-white",
                    action: () => console.log("Ação do botão 2")
                }}
                isOpen={true}
                onClose={() => console.log("Modal fechado")}
            />
            <h1>Testes Page</h1>
        </div>
    );
}