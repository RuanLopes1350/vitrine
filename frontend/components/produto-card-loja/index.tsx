'use client';

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="h-[420px] bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100">
      {/* Imagem do produto */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome_produto}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl text-gray-400">📦</span>
              </div>
              <span className="text-sm text-gray-400 font-medium">Sem imagem</span>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 flex flex-col justify-between h-[calc(420px-192px)]">
        {/* Conteúdo superior (título, descrição, preço) */}
        <div className="space-y-3 flex-1">
          {/* Título do produto */}
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-[#9333EA] transition-colors">
            {produto.nome_produto}
          </h3>

          {/* Descrição */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed overflow-y-auto"
          style={{
            scrollbarWidth: 'none'
          }}
          >
            {produto.descricao}
          </p>

          {/* Preço */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#9333EA]">
              R$ {produto.preco.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
        
        {/* Botão WhatsApp - sempre no bottom */}
        <div className="mt-4">
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white transition-colors group/btn cursor-pointer"
          >
            {/* <MessageCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" /> */}
            <img src="whatsapp2.svg" alt="" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}