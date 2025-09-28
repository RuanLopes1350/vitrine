import Header from "@/components/header";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientLayout from "@/components/ClientLayout.tsx";

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