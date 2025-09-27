"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useAuth';

export default function PerfilPage() {
    const { user, logout } = useAuth();
    const { isLoading } = useRequireAuth(); // Protege a rota

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Carregando...</p>
            </div>
        );
    }

    if (!user) {
        return null; // useRequireAuth já vai redirecionar
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
            
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Nome:
                    </label>
                    <p className="text-gray-900">{user.nome}</p>
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        ID:
                    </label>
                    <p className="text-gray-500 text-sm">{user.id}</p>
                </div>
                
                <button 
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                    Fazer Logout
                </button>
            </div>
        </div>
    );
}