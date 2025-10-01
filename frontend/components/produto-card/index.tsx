'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConfirmModal from '@/components/confirm-modal';

interface Produto {
  _id: string;
  titulo: string;
  descricao: string;
  preco: number;
  foto: string;
  usuarioId: string;
  whatsapp?: string;
}

interface ProdutoCardProps {
  produto: Produto;
  modo?: 'visualizar' | 'gerenciar';
  onEdit?: (produto: Produto) => void;
  onDelete?: (produtoId: string) => void;
}

export default function ProdutoCard({
  produto,
  modo = 'visualizar',
  onEdit,
  onDelete
}: ProdutoCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const whatsAppRedirect = () => {
    const mensagem = `Olá! Tenho interesse no produto: "${produto.titulo}" no valor de R$ ${produto.preco?.toFixed(2).replace('.', ',')}. Poderia me dar mais informações?`;
    const numeroWhatsApp = produto.whatsapp;

    if (!numeroWhatsApp) {
      alert('WhatsApp não disponível para este produto');
      return;
    }

    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(produto);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(produto._id);
    }
  };

  const isGerenciar = modo === 'gerenciar';

  return (
    <div className={`
      ${isGerenciar ? 'bg-white border border-gray-100' : 'bg-gray-50'} 
      rounded-xl overflow-hidden shadow-sm 
      ${isGerenciar ? 'hover:shadow-md' : 'hover:shadow-lg'} 
      transition-shadow duration-300 
      flex flex-col h-full
    `}>
      <div className="relative h-48 bg-gray-200 flex-shrink-0">
        <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {isGerenciar ? 'R$' : '$'} {produto.preco?.toFixed(2).replace('.', ',')}
        </div>

        {produto.foto ? (
          <Image
            src={produto.foto}
            alt={produto.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
              <span className="text-sm">Produto Imagem</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className={`
          ${isGerenciar ? 'font-bold' : 'font-semibold'} 
          text-gray-900 text-base leading-tight mb-2 overflow-hidden
        `}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '1.5rem'
          }}>
          {produto.titulo}
        </h3>
          <p className="text-gray-600 text-sm leading-relaxed overflow-y-auto"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: isGerenciar ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              minHeight: isGerenciar ? '3.5rem' : '5.75rem',
              scrollbarWidth: 'none'
            }}>
            {produto.descricao}
          </p>

        <div className={`flex gap-2 mt-3 ${!isGerenciar ? 'pt-3 border-t border-gray-200' : ''} min-h-[2.5rem]`}>
          {isGerenciar ? (
            <>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="flex-1 border-[#9333EA] text-[#9333EA] hover:bg-[#9333EA] hover:text-white"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="outline"
                size="sm"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            </>
          ) : (
            <button
              onClick={whatsAppRedirect}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <MessageCircle size={14} />
              WhatsApp
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Excluir Produto"
        message={`Tem certeza que deseja excluir o produto "${produto.titulo}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}