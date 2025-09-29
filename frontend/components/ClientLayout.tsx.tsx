"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/header";
import React from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </AuthProvider>
  );
}