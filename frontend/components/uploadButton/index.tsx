import { ChangeEvent, useState } from "react";

type UploadStatus = 'fila' | 'upando' | 'sucesso' | 'falha'

interface UploadButtonProps {
    onFileSelect: (file: File, previewUrl: string) => void;
    selectedFile?: File | null;
}

export default function UploadButton({ onFileSelect, selectedFile }: UploadButtonProps) {
    const [file, setFile] = useState<File | null>(null)
    const [status, setStatus] = useState<UploadStatus>('fila')

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Verificar se é imagem
            if (file.type.startsWith('image/')) {
                // Criar URL temporária para preview
                const previewUrl = URL.createObjectURL(file);
                setFile(file);
                onFileSelect(file, previewUrl);
            } else {
                alert('Por favor, selecione apenas arquivos de imagem.');
            }
        }
    }

    return (
        <div className="space-y-2">
            <input type="file" onChange={handleFileChange} />
            {file && (
                <div className="mb-4 text-sm">
                    <p>File name: {file.name}</p>
                    <p>Size: ${(file.size / 1024).toFixed(2)} KB</p>
                    <p>Type: ${file.type}</p>
                </div>
            )}
            {file && status !== "upando" && <button>Upload</button>}
        </div>
    )
}