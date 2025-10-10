import { useRef, useEffect, useState } from "react";

interface ModalProps {
    titulo: string;
    button1: {
        texto: string;
        className: string;
        action: () => void;
    };
    button2?: {
        texto: string;
        className: string;
        action: () => void;
    };
    isOpen: boolean;
    onClose: () => void;
    // Valores controlados (controlled components)
    formValues: {
        nome: string;
        descricao: string;
        preco: string;
    };
    onFormChange: (campo: 'nome' | 'descricao' | 'preco', valor: string) => void;
    selectedFile?: File | null;
    previewUrl?: string | null;
    onFileSelect?: (file: File, previewUrl: string) => void;
}

export default function Modal({
    titulo,
    button1,
    button2,
    isOpen,
    onClose,
    formValues,
    onFormChange,
    selectedFile,
    previewUrl,
    onFileSelect
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modalElement = dialogRef.current;
        if (!modalElement) {
            return;
        }

        if (isOpen) {
            modalElement.showModal();
        } else {
            modalElement.close();
        }
    }, [isOpen]);

    const handlePrimaryAction = () => {
        button1.action();
        onClose();
    };

    const handleSecondaryAction = () => {
        if (button2) {
            button2.action();
        }
        onClose();
    };

    return (
        <dialog
            data-testid="modal"
            ref={dialogRef}
            onCancel={onClose}
            className="w-full max-w-lg rounded-xl p-0 shadow-2xl backdrop:bg-gray-900/60 backdrop:blur-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            <div className="w-lg h-auto">
                <div className="flex flex-col gap-4 p-0">
                    <div className="flex flex-col items-start justify-center bg-gradient-to-r from-[#9333EA] to-[#4338CA] w-[100%] h-[68px]">
                        <h2 data-testid="modal-titulo" className="pl-4 text-white font-bold text-[17px] select-none">{titulo}</h2>
                    </div>
                    <div className="flex flex-row  gap-0.5 ml-[24px] translate-x-7.5">
                        <img src="/title.png" draggable={false} />
                        <h4 data-testid="modal-label-nome" className="text-[#374151] font-medium text-[11.9px]">Nome do Produto</h4>
                    </div>
                    <input 
                        data-testid="modal-input-nome" 
                        type="text" 
                        value={formValues.nome} 
                        onChange={(e) => onFormChange('nome', e.target.value)} 
                        placeholder="Insira o nome do produto" 
                        className="ml-[24px] w-[400px] h-[50px] rounded-[8px] border border-gray-300 pl-1.5 translate-x-7.5" 
                    />
                    <div className="flex flex-row ml-[24px] gap-0.5 translate-x-7.5">
                        <img src="/description.png" draggable={false} />
                        <h4 data-testid="modal-label-descricao" className="text-[#374151] font-medium text-[11.9px]">Descrição</h4>
                    </div>
                    <textarea 
                        data-testid="modal-input-descricao" 
                        value={formValues.descricao} 
                        onChange={(e) => onFormChange('descricao', e.target.value)} 
                        placeholder="Insira a descrição do produto"
                        className="ml-[24px] w-[400px] h-[122px] rounded-[8px] border border-gray-300 resize-none pl-1.5 translate-x-7.5"
                    ></textarea>
                    <div className="flex flex-row ml-[24px] gap-0.5 translate-x-7.5">
                        <img src="/cash.png" draggable={false} />
                        <h4 data-testid="modal-label-preco" className="text-[#374151] font-medium text-[11.9px]">Preço</h4>
                    </div>
                    <input
                        data-testid="modal-input-preco"
                        type="number"
                        value={formValues.preco}
                        onChange={(e) => onFormChange('preco', e.target.value)}
                        placeholder="R$ 50.00"
                        className="ml-[24px] w-[400px] h-[50px] rounded-[8px] border border-gray-300 pl-1.5 translate-x-7.5
                        [-moz-appearance:textfield] /* Para Firefox */ 
                        [&::-webkit-outer-spin-button]:appearance-none /* Para WebKit */ 
                        [&::-webkit-inner-spin-button]:appearance-none /* Para WebKit */"
                    />
                    <div className="flex flex-row ml-[24px] gap-0.5 translate-x-7.5">
                        <img src="/preview.png" draggable={false} />
                        <h4 data-testid="modal-label-imagem" className="text-[#374151] font-medium text-[11.9px]">Imagem do Produto</h4>
                    </div>
                    <div className="ml-[24px] translate-x-7.5">
                        <input
                            data-testid="modal-input-file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0] && onFileSelect) {
                                    const file = e.target.files[0];
                                    if (file.type.startsWith('image/')) {
                                        const preview = URL.createObjectURL(file);
                                        onFileSelect(file, preview);
                                    } else {
                                        alert('Por favor, selecione apenas arquivos de imagem.');
                                    }
                                }
                            }}
                            className="w-[400px] h-[50px] rounded-[8px] border border-gray-300 pl-1.5 pt-1.5 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                        {selectedFile && (
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Arquivo: {selectedFile.name}</p>
                                <p>Tamanho: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                        )}
                    </div>
                    {previewUrl && (
                        <div data-testid="modal-preview-imagem" className="h-[202px] w-[400px] overflow-hidden ml-[24px] translate-x-7.5 rounded-[8px] border border-gray-300">
                            <img
                                data-testid="modal-imagem-preview"
                                src={previewUrl}
                                alt="Preview do produto"
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                                onLoad={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'block';
                                }}
                                draggable={false}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-row justify-center gap-4 mt-6 mr-6 pb-6">
                    <button data-testid="modal-botao-principal" onClick={handlePrimaryAction} className={`h-[46px] w-[95.33px] rounded-[8px] cursor-pointer ${button1.className}`}>{button1.texto}</button>
                    {button2 && <button data-testid="modal-botao-secundario" onClick={handleSecondaryAction} className={`h-[46px] w-[95.33px] rounded-[8px] cursor-pointer ${button2.className}`}>{button2.texto}</button>}
                </div>
            </div>
        </dialog>
    )
}