'use client';

import Image from 'next/image';
import { MessageCircle, Send } from 'lucide-react';

interface Produto {
  _id: string
  titulo: string
  descricao: string
  preco: number
  foto: string
  usuarioId: string
}

interface ProdutoCardProps {
  produtos: Produto
}

export default function ProdutosCard({ produtos }: ProdutoCardProps) {
  const whatsAppRedirect = () => {
    const mensagem = `Olá! Tenho interesse no produto: "${produtos.titulo}" no valor de R$ ${produtos.preco?.toFixed(2).replace('.', ',')}. Poderia me dar mais informações?`;
    const numeroWhatsApp = "5511999999999";
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer">
      <div className="relative h-48 bg-gray-200">
        <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          ${produtos.preco?.toFixed(2) || '0.00'}
        </div>
        
        {produtos.foto ? (
          <Image 
            src={produtos.foto} 
            alt={produtos.titulo} 
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
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 overflow-hidden" 
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
          {produtos.titulo}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed overflow-hidden"
           style={{
             display: '-webkit-box',
             WebkitLineClamp: 3,
             WebkitBoxOrient: 'vertical',
           }}>
          {produtos.descricao}
        </p>
        
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
          <button 
            onClick={whatsAppRedirect}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <MessageCircle size={14} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}