import { useRef, useEffect } from "react";

interface ModalProps {
    titulo: string;
    label1: string;
    placeholder1: string;
    label2: string;
    placeholder2: string;
    label3: string;
    placeholder3: string;
    label4: string;
    placeholder4: string;
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

export default function Modal({ titulo, label1, placeholder1, label2, placeholder2, label3, placeholder3, label4, placeholder4, button1, button2, isOpen, onClose }: ModalProps) {
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
        <dialog ref={dialogRef} onCancel={onClose} className="w-full max-w-lg rounded-xl p-0 shadow-2xl backdrop:bg-gray-900/60 backdrop:blur-sm fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-[448px] h-[658px]">
                <h2>{titulo}</h2>
                <h4>{label1}</h4>
                <input type="text" id="input1" placeholder={placeholder1} />
                <h4>{label2}</h4>
                <input type="text" id="input2" placeholder={placeholder2} />
                <h4>{label3}</h4>
                <input type="text" id="input3" placeholder={placeholder3} />
                <h4>{label4}</h4>
                <input type="text" id="input4" placeholder={placeholder4} />
                <button className={button1.className}>{button1.texto}</button>
                {button2 && <button className={button2.className}>{button2.texto}</button>}
            </div>
        </dialog>
    )
}