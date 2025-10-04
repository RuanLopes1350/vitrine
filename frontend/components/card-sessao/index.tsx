'use client';

import { useState, useMemo, useCallback } from "react";
import { ShoppingBag} from "lucide-react";
import Image from 'next/image';

interface CardSessaoProps {
  modo?: 'visitante' | 'logado';
  nomeUsuario?: string;
  nomeLoja?: string;
  fotoUsuario?: string;
  id?:string;
}

export default function CardSessao({ 
  modo = 'visitante',
  nomeUsuario = '',
  nomeLoja = '',
  fotoUsuario,
  id 
}: CardSessaoProps) {
  const [copiado, setCopiado] = useState(false);
  
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };
  
  // ✅ Memoizar cálculos derivados
  const linkCompleto = useMemo(() => {
    return origin + "/" + nomeLoja.toLowerCase() + "-" + id;
  }, [nomeLoja, id]);
  
  const linkTruncado = useMemo(() => {
    const maxLength = Math.floor(linkCompleto.length * 0.5);
    return linkCompleto.length > maxLength ? linkCompleto.slice(0, maxLength) + '...' : linkCompleto;
  }, [linkCompleto]);
  
  // ✅ Memoizar função de cópia
  const copiarLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(linkCompleto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = linkCompleto;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }, [linkCompleto]);
  if (modo === 'logado') {
    return (
      <div className="bg-gradient-to-r from-[#9333EA] to-[#7C3AED] rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3 sm:space-x-6 w-full sm:w-auto">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center ring-2 sm:ring-4 ring-white ring-opacity-20 flex-shrink-0">
            {fotoUsuario ? (
              <Image
                src={fotoUsuario}
                alt={`Foto de ${nomeUsuario}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 48px, 64px"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-[#9333EA]">
                {getInitials(nomeUsuario)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">{nomeLoja}</h2>
            <p className="text-purple-100 text-xs sm:text-sm">Sua loja digital está pronta para brilhar!</p>
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-auto">
          <span className="p-[2px] font-bold text-sm sm:text-base">Link da Loja:</span>
          <span
            title={copiado ? "Link Copiado!" : "Copiar link da loja"} 
            className={` flex items-center justify-center gap-[2px] transition-all duration-300 ease-in-out text-white p-[2px] rounded text-xs sm:text-sm break-all sm:break-normal ${
              copiado 
                ? 'bg-green-500 bg-opacity-30' 
                : ''
            }`}
          >
            {copiado ? "✓ Copiado!" : linkTruncado}
            <img src="copy.svg" alt="" className={`h-[24px] rounded-[4px] cursor-pointer p-[3px] ${+ copiado ?  'hidden':'hover:bg-[rgba(0,0,0,0.2)]'}`} onClick={copiarLink} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#F3E8FF] dark:bg-purple-900/30 rounded-xl mb-4 sm:mb-6 border border-[#E9D5FF] dark:border-purple-700">
          <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-[#9333EA] dark:text-purple-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-gray-100 mb-3 sm:mb-4 px-2">
          Bem-vindo à Vitrine!
        </h1>

        <div className="max-w-2xl mx-auto space-y-2 px-4">
          <p className="text-[#4B5563] dark:text-gray-400 text-base sm:text-lg leading-relaxed">
            A maneira mais fácil de mostrar seus produtos e se conectar com os clientes diretamente pelo WhatsApp.
          </p>
          <p className="text-[#4B5563] dark:text-gray-400 text-base sm:text-lg">
            Crie sua loja hoje e comece a vender em minutos!
          </p>
        </div>
      </div>
    </div>
  );
}