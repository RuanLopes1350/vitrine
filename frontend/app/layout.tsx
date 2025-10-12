import "./globals.css";
import ClientLayout from "@/components/ClientLayout.tsx";
import { Metadata } from "next";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: 'Vitrine - Sua loja online',
  description: 'Crie sua vitrine de produtos e compartilhe com seus clientes de forma simples e direta.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Vitrine - Sua loja online',
    description: 'Crie sua vitrine de produtos e compartilhe com seus clientes de forma simples e direta.',
    url: 'https://vitrine-fawn.vercel.app/',
    siteName: 'Vitrine',
    images: [
      {
        url: 'https://i.imgur.com/wGm9Y07.png',
        width: 1200,
        height: 630,
        alt: 'Logo do projeto Vitrine',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="pt-BR">
      <body className="h-screen flex flex-col">
        <Analytics />
        <ClientLayout>{children}</ClientLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}