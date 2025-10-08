'use client';

import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700 flex flex-col h-full">
      {/* Imagem do produto */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome_produto}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl text-gray-400 dark:text-gray-500">📦</span>
              </div>
              <span className="text-sm text-gray-400 dark:text-gray-500 font-medium">Sem imagem</span>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Título - altura fixa para alinhamento */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-2 overflow-hidden line-clamp-2 group-hover:text-[#9333EA] dark:group-hover:text-purple-400 transition-colors h-[4.2rem]">
          {produto.nome_produto}
        </h3>

        {/* Descrição - altura fixa com scroll */}
        <div 
          className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3 overflow-y-auto pr-1 h-[4.5rem]"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#E5E7EB transparent'
          }}
        >
          {produto.descricao}
        </div>

        {/* Preço */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-[#9333EA] dark:text-purple-400">
            R$ {produto.preco.toFixed(2).replace('.', ',')}
          </span>
        </div>
        
        {/* Botão WhatsApp - sempre no bottom */}
        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full bg-[#25D366] dark:bg-green-600 hover:bg-[#22c55e] dark:hover:bg-green-700 text-white transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
}