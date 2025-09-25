'use client';

import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProdutoCardGerenciar from "../produto-card-gerenciar";

interface Produto {
  _id: string;
  titulo: string;
  descricao: string;
  preco: number;
  foto: string;
  usuarioId: string;
}

const produtos: Produto[] = [
  {
    _id: "1",
    titulo: "Handcrafted Leather Wallet",
    descricao: "Genuine leather wallet with multiple card slots",
    preco: 89.99,
    foto: "/Image.png",
    usuarioId: "user1"
  },
  {
    _id: "2", 
    titulo: "Ceramic Coffee Mug",
    descricao: "Handmade ceramic mug, perfect for your morning coffee",
    preco: 24.99,
    foto: "/Image (1).png",
    usuarioId: "user1"
  },
  {
    _id: "3",
    titulo: "Organic Cotton T-Shirt",
    descricao: "Soft, comfortable made from 100% organic cotton",
    preco: 29.99,
    foto: "/Image (2).png",
    usuarioId: "user1"
  }
];

interface ProdutosGerenciarProps {
  onAddProduct?: () => void;
}

export default function ProdutosGerenciar({ onAddProduct }: ProdutosGerenciarProps) {
  const handleEditProduct = (produto: Produto) => {
    console.log('Editando produto:', produto);
  };

  const handleDeleteProduct = (produtoId: string) => {
    console.log('Excluindo produto:', produtoId);
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      console.log('Adicionando novo produto');
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border p-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-[#F3E8FF] p-2 rounded-lg border border-[#E9D5FF]">
            <ShoppingBag className="h-5 w-5 text-[#9333EA]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111827]">Manage Your Products</h2>
        </div>
        
        <Button 
          onClick={handleAddProduct}
          className="bg-[#9333EA] hover:bg-[#7C3AED] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Produto
        </Button>
      </div>

      {produtos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <ProdutoCardGerenciar 
              key={produto._id} 
              produto={produto}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            Comece adicionando seu primeiro produto à vitrine.
          </p>
          <Button 
            onClick={handleAddProduct}
            className="bg-[#9333EA] hover:bg-[#7C3AED] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Produto
          </Button>
        </div>
      )}
    </section>
  );
}