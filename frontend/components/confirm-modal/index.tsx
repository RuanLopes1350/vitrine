'use client';

import { useRef, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = 'danger'
}: ConfirmModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const modalElement = dialogRef.current;
        if (!modalElement) return;

        if (isOpen) {
            modalElement.showModal();
        } else {
            modalElement.close();
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    const typeConfig = {
        danger: {
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
            borderColor: 'border-red-200'
        },
        warning: {
            iconColor: 'text-yellow-600',
            iconBg: 'bg-yellow-100',
            confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
            borderColor: 'border-yellow-200'
        },
        info: {
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
            borderColor: 'border-blue-200'
        }
    };

    const config = typeConfig[type];

    return (
        <dialog
            ref={dialogRef}
            onCancel={onClose}
            className="rounded-xl shadow-2xl backdrop:bg-gray-900/50 backdrop:backdrop-blur-sm p-0 border-0 max-w-md w-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
            <div className={`bg-white rounded-xl border ${config.borderColor} overflow-hidden`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center`}>
                            <AlertTriangle className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-end space-x-3 p-4 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.confirmButton}`}
                        style={{ minWidth: '80px' }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </dialog>
    );
}