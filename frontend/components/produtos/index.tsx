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
  refreshKey?: number; // Nova prop para forçar refresh
  onRefresh?: () => void; // Callback para notificar refresh
}

export default function Produtos({ 
  modo = 'visualizar',
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  refreshKey,
  onRefresh 
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
  }, [modo, isAuthenticated, user, refreshKey]); // Inclui refreshKey como dependência
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
      if (result.success) {
        // Notifica o componente pai para fazer refresh
        if (onRefresh) {
          onRefresh();
        }
      } else {
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
      <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#9333EA]" />
          <span className="ml-3 text-sm sm:text-base text-gray-600">Carregando produtos...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center py-8 sm:py-12">
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Erro ao carregar produtos</h3>
            <p className="text-sm sm:text-base text-red-500 mb-3 sm:mb-4">{error}</p>
            <Button 
              onClick={() => modo === 'gerenciar' && user ? buscarProdutosPorUsuario() : buscarProdutos()}
              variant="outline"
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-[#F3E8FF] p-1.5 sm:p-2 rounded-lg border border-[#E9D5FF]">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[#9333EA]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">{titulo}</h2>
        </div>
        {isGerenciar && (
          <Button 
            onClick={handleAddProduct}
            className="bg-[#9333EA] hover:bg-[#7C3AED] text-white w-full sm:w-auto text-sm sm:text-base"
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
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Comece adicionando seu primeiro produto à vitrine.
            </p>
            <Button 
              onClick={handleAddProduct}
              className="bg-[#9333EA] hover:bg-[#7C3AED] text-white w-full sm:w-auto text-sm sm:text-base"
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