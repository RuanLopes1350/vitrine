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
    defaultValues?: {
        input1?: string;
        input2?: string;
        input3?: string;
        input4?: string;
    };
    inputIds?: {
        input1?: string;
        input2?: string;
        input3?: string;
        input4?: string;
    };
}

export default function Modal({ 
    titulo, 
    button1, 
    button2, 
    isOpen, 
    onClose, 
    defaultValues,
    inputIds 
}: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [imagePreview, setImagePreview] = useState('');

    // IDs dos inputs (podem ser customizados para permitir múltiplos modais)
    const ids = {
        input1: inputIds?.input1 || 'input1',
        input2: inputIds?.input2 || 'input2',
        input3: inputIds?.input3 || 'input3',
        input4: inputIds?.input4 || 'input4'
    };

    useEffect(() => {
        const modalElement = dialogRef.current;
        if (!modalElement) {
            return;
        }

        if (isOpen) {
            // Abre o modal de forma nativa e centralizada
            modalElement.showModal();
            
            // Preenche os campos com valores padrão se fornecidos
            if (defaultValues) {
                const input1 = document.getElementById(ids.input1) as HTMLInputElement;
                const input2 = document.getElementById(ids.input2) as HTMLTextAreaElement;
                const input3 = document.getElementById(ids.input3) as HTMLInputElement;
                const input4 = document.getElementById(ids.input4) as HTMLInputElement;
                
                if (input1 && defaultValues.input1) input1.value = defaultValues.input1;
                if (input2 && defaultValues.input2) input2.value = defaultValues.input2;
                if (input3 && defaultValues.input3) input3.value = defaultValues.input3;
                if (input4 && defaultValues.input4) {
                    input4.value = defaultValues.input4;
                    setImagePreview(defaultValues.input4);
                }
            }
        } else {
            // Fecha o modal
            modalElement.close();
            
            // Limpa os campos quando o modal fecha
            setImagePreview('');
            const input1 = document.getElementById(ids.input1) as HTMLInputElement;
            const input2 = document.getElementById(ids.input2) as HTMLTextAreaElement;
            const input3 = document.getElementById(ids.input3) as HTMLInputElement;
            const input4 = document.getElementById(ids.input4) as HTMLInputElement;
            
            if (input1) input1.value = '';
            if (input2) input2.value = '';
            if (input3) input3.value = '';
            if (input4) input4.value = '';
        }
    }, [isOpen, defaultValues, ids]);


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
            <div className="w-lg h-[658px]">
                <div className="flex flex-col gap-4 p-0">
                    <div className="flex flex-col items-start justify-center bg-gradient-to-r from-[#9333EA] to-[#4338CA] w-[100%] h-[68px]">
                        <h2 data-testid="modal-titulo" className="pl-4 text-white font-bold text-[17px] select-none">{titulo}</h2>
                    </div>
                    <div className="flex flex-row  gap-0.5 ml-[24px] translate-x-7.5">
                        <img src="/title.png" draggable={false} />
                        <h4 data-testid="modal-label-nome" className="text-[#374151] font-medium text-[11.9px]">Nome do Produto</h4>
                    </div>
                    <input data-testid="modal-input-nome" type="text" id={ids.input1} placeholder="Insira o nome do produto" className="ml-[24px] w-[400px] h-[50px] rounded-[8px] border border-gray-300 pl-1.5 translate-x-7.5" />
                    <div className="flex flex-row ml-[24px] gap-0.5 translate-x-7.5">
                        <img src="/description.png" draggable={false} />
                        <h4 data-testid="modal-label-descricao" className="text-[#374151] font-medium text-[11.9px]">Descrição</h4>
                    </div>
                    <textarea data-testid="modal-input-descricao" id={ids.input2} placeholder="Insira a descrição do produto"
                        className="ml-[24px] w-[400px] h-[122px] rounded-[8px] border border-gray-300 resize-none pl-1.5 translate-x-7.5"
                    ></textarea>
                    <div className="flex flex-row ml-[24px] gap-0.5 translate-x-7.5">
                        <img src="/cash.png" draggable={false} />
                        <h4 data-testid="modal-label-preco" className="text-[#374151] font-medium text-[11.9px]">Preço</h4>
                    </div>
                    <input
                        data-testid="modal-input-preco"
                        type="number"
                        id={ids.input3}
                        placeholder="R$ 50.00"
                        className="ml-[24px] w-[400px] h-[50px] rounded-[8px] border border-gray-300 pl-1.5 translate-x-7.5
                        [-moz-appearance:textfield] /* Para Firefox */ 
                        [&::-webkit-outer-spin-button]:appearance-none /* Para WebKit */ 
                        [&::-webkit-inner-spin-button]:appearance-none /* Para WebKit */"
                    />
                    <div className="flex flex-row ml-[24px] gap-0.5 translate-x-7.5">
                        <img src="/preview.png" draggable={false} />
                        <h4 data-testid="modal-label-imagem" className="text-[#374151] font-medium text-[11.9px]">URL da Imagem</h4>
                    </div>
                    <input
                        data-testid="modal-input-imagem"
                        type="text"
                        id={ids.input4}
                        placeholder="Insira a URL da imagem"
                        value={imagePreview}
                        onChange={(e) => setImagePreview(e.target.value)}
                        className="ml-[24px] w-[400px] h-[50px] rounded-[8px] border border-gray-300 pl-1.5 translate-x-7.5"
                    />
                    {imagePreview && (
                        <div data-testid="modal-preview-imagem" className="border-1 h-[202px] w-[400px] overflow-hidden ml-[24px] translate-x-7.5 rounded-[8px]">
                            <img
                                data-testid="modal-imagem-preview"
                                src={imagePreview}
                                alt="Preview do produto"
                                className="h-full w-full object-cover"
                                onError={(e) => e.currentTarget.style.display = 'none'}
                                draggable={false}
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-row justify-center gap-4 mt-6 mr-6 pb-6">
                    <button data-testid="modal-botao-principal" onClick={() => { handlePrimaryAction(); setImagePreview(''); }} className={`h-[46px] w-[95.33px] rounded-[8px] cursor-pointer ${button1.className}`}>{button1.texto}</button>
                    {button2 && <button data-testid="modal-botao-secundario" onClick={() => { handleSecondaryAction(); setImagePreview(''); }} className={`h-[46px] w-[95.33px] rounded-[8px] cursor-pointer ${button2.className}`}>{button2.texto}</button>}
                </div>
            </div>
        </dialog>
    )
}