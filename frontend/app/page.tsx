// vitrine/frontend/app/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Esta lógica agora é segura, pois só roda no cliente após a montagem.
    router.replace('/login');
  }, [router]);

  // Renderiza um placeholder nulo ou uma tela de carregamento
  // enquanto o redirecionamento acontece.
  return null;
}