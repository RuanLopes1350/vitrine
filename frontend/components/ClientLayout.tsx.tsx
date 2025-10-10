"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/header";
import React from "react";
import { Analytics } from "@vercel/analytics/react";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Header />
        <main className="flex-grow">
          {children}
        <Analytics />
        </main>
      </AuthProvider>
    </ThemeProvider>
  );
}