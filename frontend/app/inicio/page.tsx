'use client';

import { useState, useEffect } from 'react';
import CardInicio from "@/components/card-sessao";
import CardSessaoLogado from "@/components/card-sessao-logado";
import Produtos from "@/components/produtos";
import ProdutosGerenciar from "@/components/produtos-gerenciar";
import DebugAuthToggle from "@/components/debug-auth";

export default function InicioPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    nomeUsuario: 'Millennium',
    nomeLoja: 'Millennium',
    fotoUsuario: '' as string | undefined
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleDebugToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    if (!isLoggedIn) {
      localStorage.setItem('authToken', 'debug-token');
    } else {
      localStorage.removeItem('authToken');
    }
  };

  return (
    <main className="flex-1 bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {isLoggedIn ? (
          <>
            <CardSessaoLogado 
              nomeUsuario={userData.nomeUsuario}
              nomeLoja={userData.nomeLoja}
              fotoUsuario={userData.fotoUsuario}
            />
            <ProdutosGerenciar />
          </>
        ) : (
          <>
            <CardInicio />
            <Produtos />
          </>
        )}
      </div>
      
      <DebugAuthToggle isLoggedIn={isLoggedIn} onToggle={handleDebugToggle} />
    </main>
  );
}