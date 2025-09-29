'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CardSessao from "@/components/card-sessao";
import Produtos from "@/components/produtos";
import Modal from "@/components/modal";
import { useProdutos, Produto } from '@/hooks/useProdutos';
import { useToast, ToastContainer } from '@/components/ui/toast';
import { useRequireAuth } from '@/hooks/useAuth';

export default function InicioPage() {
  useRequireAuth();

  const { user, isAuthenticated, isLoading } = useAuth();
  const { adicionarProduto, editarProduto } = useProdutos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Estado para controlar refresh
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Função para fazer refresh da lista de produtos
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleEditProduct = (produto: Produto) => {
    setProdutoParaEditar(produto);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async () => {
    // Obter valores dos campos do modal de cadastro
    const nome = (document.getElementById('input1') as HTMLInputElement)?.value?.trim();
    const descricao = (document.getElementById('input2') as HTMLTextAreaElement)?.value?.trim();
    const precoStr = (document.getElementById('input3') as HTMLInputElement)?.value?.trim();
    const foto = (document.getElementById('input4') as HTMLInputElement)?.value?.trim();

    // Validações básicas de campos obrigatórios
    if (!nome) {
      showError('Nome do produto é obrigatório');
      return;
    }

    if (!descricao) {
      showError('Descrição é obrigatória');
      return;
    }

    if (!precoStr) {
      showError('Preço é obrigatório');
      return;
    }

    const preco = parseFloat(precoStr);
    if (isNaN(preco)) {
      showError('Preço deve ser um número válido');
      return;
    }

    try {
      const result = await adicionarProduto({
        titulo: nome,
        descricao,
        preco,
        foto: foto || '/placeholder-image.png'
      }, triggerRefresh, showError); // Passa showError para tratamento de erros de validação

      if (result.success) {
        // Limpa os campos
        (document.getElementById('input1') as HTMLInputElement).value = '';
        (document.getElementById('input2') as HTMLTextAreaElement).value = '';
        (document.getElementById('input3') as HTMLInputElement).value = '';
        (document.getElementById('input4') as HTMLInputElement).value = '';
        
        showSuccess('Produto cadastrado com sucesso!');
        setIsModalOpen(false);
      }
    } catch (error) {
      showError('Erro interno ao cadastrar produto');
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  const handleSaveEditProduct = async () => {
    if (!produtoParaEditar) return;

    // Obter valores dos campos do modal de edição
    const nome = (document.getElementById('edit-input1') as HTMLInputElement)?.value?.trim();
    const descricao = (document.getElementById('edit-input2') as HTMLTextAreaElement)?.value?.trim();
    const precoStr = (document.getElementById('edit-input3') as HTMLInputElement)?.value?.trim();
    const foto = (document.getElementById('edit-input4') as HTMLInputElement)?.value?.trim();

    // Validações básicas de campos obrigatórios
    if (!nome) {
      showError('Nome do produto é obrigatório');
      return;
    }

    if (!descricao) {
      showError('Descrição é obrigatória');
      return;
    }

    if (!precoStr) {
      showError('Preço é obrigatório');
      return;
    }

    const preco = parseFloat(precoStr);
    if (isNaN(preco)) {
      showError('Preço deve ser um número válido');
      return;
    }

    try {
        const result = await editarProduto(produtoParaEditar._id, {
          titulo: nome,
          descricao,
          preco,
          foto: foto || '/placeholder-image.png'
        }, triggerRefresh, showError); // Passa showError para tratamento de erros de validação
        
      if (result.success) {
        showSuccess('Produto editado com sucesso!');
        setIsEditModalOpen(false);
        setProdutoParaEditar(null);
      }
    } catch (error) {
      showError('Erro interno ao editar produto');
      console.error('Erro ao editar produto:', error);
    }
  };

  // Loading state enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="bg-[#F9FAFB] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9333EA] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F9FAFB] min-h-full">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {isAuthenticated && user ? (
            <>
              <CardSessao 
                modo="logado"
                nomeUsuario={user.nome}
                nomeLoja={user.nomeLoja}
              />
              <Produtos 
                modo="gerenciar" 
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                refreshKey={refreshKey}
                onRefresh={triggerRefresh}
              />
            </>
          ) : (
            <>
              <CardSessao modo="visitante" />
              <Produtos modo="visualizar" refreshKey={refreshKey} onRefresh={triggerRefresh} />
            </>
          )}
        </div>
      </div>

      <Modal
        titulo="Cadastrar Produto"
        button1={{
          texto: "Salvar",
          className: "bg-[#9333EA] text-white hover:bg-[#7C3AED]",
          action: handleSaveProduct
        }}
        button2={{
          texto: "Cancelar",
          className: "bg-gray-300 text-gray-700 hover:bg-gray-400",
          action: () => {}
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Modal
        titulo="Editar Produto"
        button1={{
          texto: "Salvar",
          className: "bg-[#9333EA] text-white hover:bg-[#7C3AED]",
          action: handleSaveEditProduct
        }}
        button2={{
          texto: "Cancelar",
          className: "bg-gray-300 text-gray-700 hover:bg-gray-400",
          action: () => {}
        }}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setProdutoParaEditar(null);
        }}
        defaultValues={{
          input1: produtoParaEditar?.titulo || '',
          input2: produtoParaEditar?.descricao || '',
          input3: produtoParaEditar?.preco?.toString() || '',
          input4: produtoParaEditar?.foto || ''
        }}
        inputIds={{
          input1: 'edit-input1',
          input2: 'edit-input2',
          input3: 'edit-input3',
          input4: 'edit-input4'
        }}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
} 