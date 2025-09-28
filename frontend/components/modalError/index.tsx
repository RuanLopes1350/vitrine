import { useRef, useEffect } from "react";

interface ModalErrorProps {
    tipoErro: string;
    descricao: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalError({ tipoErro, descricao, isOpen, onClose }: ModalErrorProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modalElement = dialogRef.current;
        if (!modalElement) {
            return;
        }

        if (isOpen) {
            // Abre o modal de forma nativa e centralizada
            modalElement.showModal();
        } else {
            // Fecha o modal
            modalElement.close();
        }
    }, [isOpen]);

    const handleOkClick = () => {
        onClose();
    };

    return (
        <dialog
            data-testid="modal-error"
            ref={dialogRef}
            onCancel={onClose}
            className="w-full max-w-lg rounded-xl p-0 shadow-2xl backdrop:bg-gray-900/60 backdrop:blur-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            <div className="w-lg h-auto min-h-[300px]">
                <div className="flex flex-col items-center justify-center p-8 gap-6">
                    {/* Título do erro em tamanho grande */}
                    <h1 
                        data-testid="modal-error-titulo" 
                        className="text-[#CD5C5C] font-bold text-3xl text-center select-none"
                    >
                        {tipoErro}
                    </h1>
                    
                    {/* Descrição em título menor */}
                    <h2 
                        data-testid="modal-error-descricao" 
                        className="text-gray-700 font-medium text-lg text-center select-none px-4"
                    >
                        {descricao}
                    </h2>
                    
                    {/* Botão OK */}
                    <button 
                        data-testid="modal-error-botao-ok" 
                        onClick={handleOkClick}
                        className="bg-[#CD5C5C] hover:bg-[#B22222] text-white font-medium text-lg px-8 py-3 rounded-lg cursor-pointer transition-colors duration-200 min-w-[100px]"
                    >
                        OK
                    </button>
                </div>
            </div>
        </dialog>
    )
}