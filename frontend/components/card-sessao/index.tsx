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
      <div className="bg-gradient-to-r from-[#9333EA] to-[#7C3AED] rounded-xl p-8 mb-8 text-white shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center ring-4 ring-white ring-opacity-20">
            {fotoUsuario ? (
              <Image
                src={fotoUsuario}
                alt={`Foto de ${nomeUsuario}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <span className="text-2xl font-bold text-[#9333EA]">
                {getInitials(nomeUsuario)}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold">{nomeLoja}</h2>
            <p className="text-purple-100 text-sm">Sua loja digital está pronta para brilhar!</p>
          </div>
        </div>
        <div onClick={copiarLink} className="flex flex-col">
          <span className="p-[2px] font-bold">Link da Loja:</span>
          <span 
            title={copiado ? "Link Copiado!" : "Copiar link da loja"} 
            className={`transition-all duration-300 ease-in-out text-white p-[2px] rounded cursor-pointer ${
              copiado 
                ? 'bg-green-500 bg-opacity-30' 
                : 'hover:bg-[rgba(0,0,0,0.2)]'
            }`}
          >
            {copiado ? "✓ Copiado!" : linkTruncado}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 mb-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F3E8FF] rounded-xl mb-6 border border-[#E9D5FF]">
          <ShoppingBag className="h-8 w-8 text-[#9333EA]" />
        </div>

        <h1 className="text-3xl font-bold text-[#111827] mb-4">
          Bem-vindo à Vitrine!
        </h1>

        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-[#4B5563] text-lg leading-relaxed">
            A maneira mais fácil de mostrar seus produtos e se conectar com os clientes diretamente pelo WhatsApp.
          </p>
          <p className="text-[#4B5563] text-lg">
            Crie sua loja hoje e comece a vender em minutos!
          </p>
        </div>
      </div>
    </div>
  );
}