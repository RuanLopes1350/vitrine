'use client';

import { ShoppingBag, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProdutoCard from "../produto-card";
import { useProdutos, Produto } from "@/hooks/useProdutos";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from 'react';

interface ProdutosProps {
  modo?: 'visualizar' | 'gerenciar';
  onAddProduct?: () => void;
  onEditProduct?: (produto: Produto) => void;
  onDeleteProduct?: (produtoId: string) => void;
}

export default function Produtos({ 
  modo = 'visualizar',
  onAddProduct,
  onEditProduct,
  onDeleteProduct 
}: ProdutosProps) {
  const { produtos, loading, error, buscarProdutos, buscarProdutosPorUsuario, deletarProduto } = useProdutos();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (modo === 'gerenciar' && isAuthenticated && user) {
      // Se estiver no modo gerenciar, busca apenas produtos do usuário logado
      buscarProdutosPorUsuario();
    } else {
      // Se for modo visualizar, sempre busca todos os produtos
      buscarProdutos();
    }
  }, [modo, isAuthenticated, user]);
  const handleEditProduct = (produto: Produto) => {
    if (onEditProduct) {
      onEditProduct(produto);
    }
  };

  const handleDeleteProduct = async (produtoId: string) => {
    if (onDeleteProduct) {
      onDeleteProduct(produtoId);
    } else {
      const result = await deletarProduto(produtoId);
      if (!result.success) {
        console.error('Erro ao deletar produto:', result.message);
      }
    }
  };

  const handleAddProduct = () => {
    if (onAddProduct) {
      onAddProduct();
    }
  };

  const isGerenciar = modo === 'gerenciar';
  const titulo = isGerenciar ? 'Gerencie Seus Produtos' : 'Produtos';

  if (loading) {
    return (
      <section className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#9333EA]" />
          <span className="ml-3 text-gray-600">Carregando produtos...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar produtos</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <Button 
              onClick={() => modo === 'gerenciar' && user ? buscarProdutosPorUsuario() : buscarProdutos()}
              variant="outline"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-md p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-[#F3E8FF] p-2 rounded-lg border border-[#E9D5FF]">
            <ShoppingBag className="h-5 w-5 text-[#9333EA]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111827]">{titulo}</h2>
        </div>
        {isGerenciar && (
          <Button 
            onClick={handleAddProduct}
            className="bg-[#9333EA] hover:bg-[#7C3AED] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        )}
      </div>

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