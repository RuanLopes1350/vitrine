import Header from "@/components/header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="h-screen flex flex-col"> {/* <-- ALTERAÇÃO AQUI */}
        <Header nomePlataforma="Sua Plataforma" /> {/* Adicionei a prop para o exemplo */}
        {children}
      </body>
    </html>
  );
}
