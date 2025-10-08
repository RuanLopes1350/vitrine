'use client';

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

interface ProdutoLoja {
  _id: string;
  nome_produto: string;
  descricao: string;
  preco: number;
  imagem?: string;
  mensagem: string;
  criador: {
    whatsapp: string;
    nomeLoja: string;
  };
}

interface ProdutoCardLojaProps {
  produto: ProdutoLoja;
}

export default function ProdutoCardLoja({ produto }: ProdutoCardLojaProps) {
  const handleWhatsAppClick = () => {
    const whatsapp = produto.criador.whatsapp.startsWith('55') 
      ? produto.criador.whatsapp 
      : `55${produto.criador.whatsapp}`;
    
    const mensagem = encodeURIComponent(
      `Olá! Tenho interesse no produto "${produto.nome_produto}" por R$ ${produto.preco.toFixed(2).replace('.', ',')}. Poderia me dar mais informações?`
    );
    
    const url = `https://wa.me/${whatsapp}?text=${mensagem}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Imagem do produto */}
      <div className="relative h-48 bg-gray-200 flex-shrink-0 overflow-hidden">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome_produto}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
              <span className="text-sm">Sem imagem</span>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Título do produto */}
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '1.5rem'
          }}>
          {produto.nome_produto}
        </h3>

        {/* Descrição */}
        <p className="text-gray-600 text-sm leading-relaxed overflow-y-auto mb-2"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            minHeight: '5.75rem',
            scrollbarWidth: 'none'
          }}>
          {produto.descricao}
        </p>

        {/* Preço */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-[#9333EA]">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </span>
        </div>
        
        {/* Botão WhatsApp - sempre no bottom */}
        <div className="pt-3 border-t border-gray-200 min-h-[2.5rem]">
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <MessageCircle size={14} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}