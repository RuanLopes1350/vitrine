'use client';

import { useState, useEffect } from 'react';
import CardSessao from "@/components/card-sessao";
import Produtos from "@/components/produtos";
import DebugAuthToggle from "@/components/debug-auth";

interface UserData {
  nomeUsuario: string;
  nomeLoja: string;
  fotoUsuario?: string;
}

export default function InicioPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    nomeUsuario: '',
    nomeLoja: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        setUserData({
          nomeUsuario: payload.nomeUsuario || 'Usuário',
          nomeLoja: payload.nomeLoja || 'Minha Loja',
          fotoUsuario: payload.fotoUsuario
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="bg-[#F9FAFB] min-h-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {isLoggedIn ? (
          <>
            <CardSessao 
              modo="logado"
              nomeUsuario={userData.nomeUsuario}
              nomeLoja={userData.nomeLoja}
              fotoUsuario={userData.fotoUsuario}
            />
            <Produtos modo="gerenciar" />
          </>
        ) : (
          <>
            <CardSessao modo="visitante" />
            <Produtos modo="visualizar" />
          </>
        )}
      </div>
      <DebugAuthToggle 
        isLoggedIn={isLoggedIn}
        onToggle={() => {
          const newLoggedInState = !isLoggedIn;
          setIsLoggedIn(newLoggedInState);
          
          if (newLoggedInState) {
            setUserData({
              nomeUsuario: 'Millenium',
              nomeLoja: 'Millenium Store',
              fotoUsuario: undefined
            });
          } else {
            setUserData({
              nomeUsuario: '',
              nomeLoja: ''
            });
          }
        }}
      />
    </div>
  );
}