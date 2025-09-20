import Header from "@/components/header";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="h-screen flex flex-col">
        <Header nomeLoja="Sua Loja" />
        {children}
      </body>
    </html>
  );
}
