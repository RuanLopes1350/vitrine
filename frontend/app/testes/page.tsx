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
                    className: "bg-blue-500 text-white",
                    action: () => {
                        setIsOpen(false);
                        console.log("Ação cancelada!");
                    }
                }}
                button2={{
                    texto: "Salvar",
                    className: "bg-gray-500 text-white",
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
            <button onClick={() => {setIsOpen(true); console.log('Modal Aberto!')}}>abrir modal</button>
        </div>
    );
}