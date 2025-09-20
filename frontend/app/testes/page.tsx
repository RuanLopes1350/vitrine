"use client"

import Modal from "@/components/modal"

export default function TestesPage() {
    return (
        <div>
            <Modal
                titulo="Adicionar Um Novo Produto"
                label1="Nome do Produto"
                placeholder1="Insira o nome do produto"
                label2="Descrição"
                placeholder2="Insira a descrição do produto"
                label3="Preço"
                placeholder3="R$ 50.00"
                label4="URL da Imagem"
                placeholder4="Insira a URL da imagem"
                button1={{
                    texto: "Cancelar",
                    className: "bg-blue-500 text-white",
                    action: () => console.log("Ação do botão 1")
                }}
                button2={{
                    texto: "Cancelar",
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