import "./globals.css";
import ClientLayout from "@/components/ClientLayout.tsx";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: 'Vitrine',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}