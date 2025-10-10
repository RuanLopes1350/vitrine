'use client';

import { ShoppingBag, Plus, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProdutoCard from "../produto-card";
import { useProdutos, Produto } from "@/hooks/useProdutos";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from 'react';

interface ProdutosProps {
  modo?: 'visualizar' | 'gerenciar';
  onAddProduct?: () => void;
  onEditProduct?: (produto: Produto) => void;
  onDeleteProduct?: (produtoId: string) => void;
  refreshKey?: number; // Nova prop para forçar refresh
  onRefresh?: () => void; // Callback para notificar refresh
  // Props para paginação
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export default function Produtos({ 
  modo = 'visualizar',
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  refreshKey,
  onRefresh,
  currentPage = 0,
  itemsPerPage,
  onPageChange,
  onNextPage,
  onPrevPage
}: ProdutosProps) {
  const { produtos, loading, error, buscarProdutos, buscarProdutosPorUsuario, deletarProduto } = useProdutos();
  const { user, isAuthenticated } = useAuth();
  
  // Paginação
  const [internalItemsPerPage] = useState<number>(20);
  const [internalCurrentPage, setInternalCurrentPage] = useState<number>(0);
  
  // Calcular valores derivados
  const startIndex = internalCurrentPage * internalItemsPerPage;
  const endIndex = startIndex + internalItemsPerPage;
  const currentItems = produtos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(produtos.length / internalItemsPerPage);
  // Funções de navegação
  const nextPage = () => {
    if (internalCurrentPage < totalPages - 1) {
      setInternalCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (internalCurrentPage > 0) {
      setInternalCurrentPage(prev => prev - 1);
    }
  };
  
  const goToPage = (page: number) => {
    setInternalCurrentPage(page);
  };

  useEffect(() => {
    if (modo === 'gerenciar' && isAuthenticated && user) {
      // Se estiver no modo gerenciar, busca apenas produtos do usuário logado
      buscarProdutosPorUsuario();
    } else {
      // Se for modo visualizar, sempre busca todos os produtos
      buscarProdutos();
    }
    // Reset para primeira página quando mudar os produtos
    setInternalCurrentPage(0);
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
    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-[#F3E8FF] dark:bg-purple-900/30 p-1.5 sm:p-2 rounded-lg border border-[#E9D5FF] dark:border-purple-700">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-[#9333EA] dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-gray-100">{titulo}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
              {produtos.length > 0
                ? `${produtos.length} produto${produtos.length !== 1 ? 's' : ''} disponíve${produtos.length !== 1 ? 'is' : 'l'}`
                : "Nenhum produto encontrado"
              }
            </p>
          </div>
        </div>
        {isGerenciar && (
          <Button 
            onClick={handleAddProduct}
            className="bg-[#9333EA] hover:bg-[#7C3AED] dark:bg-purple-600 dark:hover:bg-purple-700 text-white w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produto
          </Button>
        )}
      </div>

      {produtos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {currentItems.map((produto) => (
              <ProdutoCard 
                key={produto._id} 
                produto={produto}
                modo={modo}
                onEdit={isGerenciar ? handleEditProduct : undefined}
                onDelete={isGerenciar ? handleDeleteProduct : undefined}
              />
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              {/* Botão Anterior */}
              <button 
                onClick={prevPage} 
                disabled={currentPage === 0}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>

              {/* Números das páginas */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === index
                        ? 'text-white bg-[#9333EA]'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Botão Próximo */}
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages - 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Próximo
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 sm:py-16 px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-xl mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
            Nenhum produto encontrado
          </h3>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed">
            {isGerenciar 
              ? "Comece adicionando seu primeiro produto à vitrine." 
              : "Esta loja ainda não possui produtos cadastrados."}
          </p>
          {isGerenciar && (
            <Button 
              onClick={handleAddProduct}
              className="bg-[#9333EA] hover:bg-[#7C3AED] text-white w-full sm:w-auto text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          )}
        </div>
      )}

      {/* Footer informativo - apenas no modo visualizar e quando há produtos */}
      {!isGerenciar && produtos.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-[#F3E8FF] to-[#EDE9FE] dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-[#9333EA] p-2 rounded-lg">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Entre em contato
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Clique no botão "WhatsApp" em qualquer produto para entrar
              em contato direto com o vendedor e tirar suas dúvidas.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}