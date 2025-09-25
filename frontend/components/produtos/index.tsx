'use client';

import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProdutoCard from "../produto-card";

interface Produto {
  _id: string;
  titulo: string;
  descricao: string;
  preco: number;
  foto: string;
  usuarioId: string;
}

interface ProdutosProps {
  modo?: 'visualizar' | 'gerenciar';
  produtos?: Produto[];
  onAddProduct?: () => void;
  onEditProduct?: (produto: Produto) => void;
  onDeleteProduct?: (produtoId: string) => void;
}

const produtosPadrao: Produto[] = [
  {
    _id: "1",
    titulo: "Algum produto que esteja sendo vendido ai",
    descricao: "Descrição detalhada do produto",
    preco: 89.99,
    foto: "/Image.png",
    usuarioId: "user1"
  },
  {
    _id: "2", 
    titulo: "Algum outro produto que esteja sendo vendido ai 2",
    descricao: "Descrição detalhada do produto",
    preco: 24.99,
    foto: "/Image (1).png",
    usuarioId: "user1"
  },
  {
    _id: "3",
    titulo: "Algum outro produto que esteja sendo vendido ai 3",
    descricao: "Descrição detalhada do produto",
    preco: 29.99,
    foto: "/Image (2).png",
    usuarioId: "user1"
  }
];

export default function Produtos({ 
  modo = 'visualizar',
  produtos = produtosPadrao,
  onAddProduct,
  onEditProduct,
  onDeleteProduct 
}: ProdutosProps) {
  const handleEditProduct = (produto: Produto) => {
    if (onEditProduct) {
      onEditProduct(produto);
    } else {
      console.log('Editando produto:', produto);
    }
  };

  const handleDeleteProduct = (produtoId: string) => {
    if (onDeleteProduct) {
      onDeleteProduct(produtoId);
    } else {
      console.log('Excluindo produto:', produtoId);
    }
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    } else {
      console.log('Adicionando novo produto');
    }
  };

  const isGerenciar = modo === 'gerenciar';
  const titulo = isGerenciar ? 'Gerencie Seus Produtos' : 'Produtos';

  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-[#F3E8FF] p-2 rounded-lg border border-[#E9D5FF]">
          <ShoppingBag className="h-5 w-5 text-[#9333EA]" />
        </div>
        <h2 className="text-2xl font-bold text-[#111827]">{titulo}</h2>
      </div>
      
      {isGerenciar && (
        <div className="flex justify-end mb-8 -mt-4">
          <Button 
            onClick={handleAddProduct}
            className="bg-[#9333EA] hover:bg-[#7C3AED] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        </div>
      )}

      {produtos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {produtos.map((produto) => (
            <ProdutoCard 
              key={produto._id} 
              produto={produto}
              modo={modo}
              onEdit={isGerenciar ? handleEditProduct : undefined}
              onDelete={isGerenciar ? handleDeleteProduct : undefined}
            />
          ))}
        </div>
      ) : (
        isGerenciar && (
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
        )
      )}
    </section>
  );
}