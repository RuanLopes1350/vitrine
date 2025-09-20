import { useRef, useEffect } from "react";

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
}

export default function Modal({ titulo, button1, button2, isOpen, onClose }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    isOpen = true;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog) {
            isOpen ? dialog.showModal() : dialog.close();
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
        <dialog ref={dialogRef} onCancel={onClose} className="w-full max-w-lg rounded-xl p-0 shadow-2xl backdrop:bg-gray-900/60 backdrop:blur-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="w-lg h-[658px]">
                <div className="flex flex-col items-start justify-center bg-gradient-to-r from-[#9333EA] to-[#4338CA] w-[100%] h-[68px]">
                    <h2 className="pl-4 text-white font-bold text-[17px] select-none">{titulo}</h2>
                </div>
                <h4 className="text-[#374151] font-medium text-[11.9px]">Nome do Produto</h4>
                <input type="text" id="input1" placeholder="Insira o nome do produto" />
                <h4 className="text-[#374151] font-medium text-[11.9px]">Descrição</h4>
                <input type="text" id="input2" placeholder="Insira a descrição do produto" />
                <h4 className="text-[#374151] font-medium text-[11.9px]">Preço</h4>
                <input
                    type="number"
                    id="input3"
                    placeholder="R$ 50.00"
                    className="
                                [-moz-appearance:textfield] /* Para Firefox */ 
                                [&::-webkit-outer-spin-button]:appearance-none /* Para WebKit */ 
                                [&::-webkit-inner-spin-button]:appearance-none /* Para WebKit */"
                />
                <h4 className="text-[#374151] font-medium text-[11.9px]">URL da Imagem</h4>
                <input type="text" id="input4" placeholder="Insira a URL da imagem" />
                <button className={button1.className}>{button1.texto}</button>
                {button2 && <button className={button2.className}>{button2.texto}</button>}
            </div>
        </dialog>
    )
}