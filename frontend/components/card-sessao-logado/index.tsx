import { User } from "lucide-react";
import Image from 'next/image';

interface CardSessaoLogadoProps {
  nomeUsuario: string;
  nomeLoja: string;
  fotoUsuario?: string;
}

export default function CardSessaoLogado({ nomeUsuario, nomeLoja, fotoUsuario }: CardSessaoLogadoProps) {
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gradient-to-r from-[#9333EA] to-[#7C3AED] rounded-xl p-8 mb-8 text-white shadow-md">
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
    </div>
  );
}