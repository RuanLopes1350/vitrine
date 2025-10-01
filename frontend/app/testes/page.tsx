"use client"

import Modal from "@/components/modal"
import { useCloudinaryUpload } from "@/hooks/useCloudinary";
import { useRef, useState } from "react";

export default function TestesPage() {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const { uploadImage, uploading, error } = useCloudinaryUpload();

    const handleSave = async () => {
        if (!selectedFile) {
            alert('Selecione um arquivo primeiro!');
            return;
        }

        console.log('Iniciando upload...');

        const result = await uploadImage(selectedFile);

        if (result) {
            console.log('Upload concluído!', result);
            console.log('URL da imagem:', result.secure_url);
            // Aqui você salvaria o produto com result.secure_url
        } else {
            console.error('Falha no upload:', error);
        }

        handleModalClose();
    };

    const handleFileSelect = (file: File, preview: string) => {
        setSelectedFile(file);
        setPreviewUrl(preview);
    };

    const handleModalClose = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl); // Importante: liberar memória
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsOpen(false);
    };
    return (
        <div>
            <Modal
                titulo="Adicionar Um Novo Produto"
                button1={{
                    texto: "Cancelar",
                    className: "bg-blue-500 text-white hover:bg-blue-600",
                    action: () => {
                        console.log("Ação cancelada!");
                        handleModalClose();
                    }
                }}
                button2={{
                    texto: uploading ? "Enviando..." : "Salvar",
                    className: `${uploading ? 'bg-gray-400' : 'bg-gray-500'} text-white hover:bg-gray-600`,
                    action: handleSave
                }}
                isOpen={isOpen}
                onClose={handleModalClose}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                onFileSelect={handleFileSelect}
            />
            <h1>Testes Page</h1>
            <button onClick={() => { setIsOpen(true); console.log('Modal Aberto!') }} className="bg-yellow-500 text-white border-1 border-yellow-700 rounded-full p-0.5">abrir modal</button>
        </div>
    );
}