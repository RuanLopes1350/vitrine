"use client"

import Modal from "@/components/modal"
import { useState } from "react";

export default function TestesPage() {

    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div>
            <Modal
                titulo="Adicionar Um Novo Produto"
                button1={{
                    texto: "Cancelar",
                    className: "bg-blue-500 text-white hover:bg-blue-600",
                    action: () => {
                        setIsOpen(false);
                        console.log("Ação cancelada!");
                    }
                }}
                button2={{
                    texto: "Salvar",
                    className: "bg-gray-500 text-white hover:bg-gray-600",
                    action: () => {
                        setIsOpen(false);
                        console.log("Produto salvo!");
                        // Qualquer outra ação que você queira realizar ao clicar em "Salvar"
                    }
                }}
                isOpen={isOpen}
                onClose={() => {setIsOpen(false), console.log("Modal fechado")}}
            />
            <h1>Testes Page</h1>
            <button onClick={() => {setIsOpen(true); console.log('Modal Aberto!')}} className="bg-yellow-500 text-white border-1 border-yellow-700 rounded-full p-0.5">abrir modal</button>
        </div>
    );
}