'use client';

import Image from 'next/image';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Produto {
  _id: string;
  titulo: string;
  descricao: string;
  preco: number;
  foto: string;
  usuarioId: string;
}

interface ProdutoCardGerenciarProps {
  produto: Produto;
  onEdit?: (produto: Produto) => void;
  onDelete?: (produtoId: string) => void;
}

export default function ProdutoCardGerenciar({ 
  produto, 
  onEdit, 
  onDelete 
}: ProdutoCardGerenciarProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(produto);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Tem certeza que deseja excluir este produto?')) {
      onDelete(produto._id);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="relative h-48 bg-gray-200">
        <div className="absolute top-3 left-3 bg-[#9333EA] text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          R$ {produto.preco?.toFixed(2).replace('.', ',')}
        </div>
        
        {produto.foto ? (
          <Image 
            src={produto.foto} 
            alt={produto.titulo} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-2 line-clamp-2">
          {produto.titulo}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {produto.descricao}
        </p>
        
        <div className="flex gap-2">
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
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}