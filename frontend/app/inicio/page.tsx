'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CardSessao from "@/components/card-sessao";
import Produtos from "@/components/produtos";
import Modal from "@/components/modal";
import { useProdutos, Produto } from '@/hooks/useProdutos';
import { useToast, ToastContainer } from '@/components/ui/toast';
import { useRequireAuth } from '@/hooks/useAuth';
import { useCloudinaryUpload } from '@/hooks/useCloudinary';
import { useProdutoValidation } from '@/hooks/useProdutoValidation';

export default function InicioPage() {
  useRequireAuth();

  const { user, isAuthenticated, isLoading } = useAuth();
  const { adicionarProduto, editarProduto } = useProdutos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Estado para controlar refresh
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Estados para upload de arquivo
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);
  const [previewEditUrl, setPreviewEditUrl] = useState<string | null>(null);
  const { uploadImage, uploading, error } = useCloudinaryUpload();
  const { validarProduto, validating } = useProdutoValidation();

  // Estado para controle do loading geral (validação + upload)
  const [processing, setProcessing] = useState(false);

  // Função para fazer refresh da lista de produtos
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Funções para controle do arquivo selecionado
  const handleFileSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
  };

  const handleEditFileSelect = (file: File, preview: string) => {
    setSelectedEditFile(file);
    setPreviewEditUrl(preview);
  };

  const handleModalClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(false);
  };

  const handleEditModalClose = () => {
    if (previewEditUrl) {
      URL.revokeObjectURL(previewEditUrl);
    }
    setSelectedEditFile(null);
    setPreviewEditUrl(null);
    setIsEditModalOpen(false);
    setProdutoParaEditar(null);
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

    if (!selectedFile) {
      showError('Selecione uma imagem para o produto');
      return;
    }

    try {
      setProcessing(true);

      console.log('Etapa 1: Validando dados no backend...');

      // ETAPA 1: Validar dados no backend
      const validationResult = await validarProduto({
        nome_produto: nome,
        descricao,
        preco,
        mensagem: `Produto: ${nome}`,
        ativo: true
      });

      if (!validationResult.success) {
        showError(validationResult.message);
        return;
      }

      console.log('Etapa 2: Dados válidos, fazendo upload da imagem...');

      // ETAPA 2: Upload da imagem para Cloudinary
      const uploadResult = await uploadImage(selectedFile);

      if (!uploadResult) {
        showError('Falha no upload da imagem');
        console.error('Falha no upload:', error);
        return;
      }

      console.log('Etapa 3: Upload concluído, salvando produto no banco...');
      console.log('URL da imagem:', uploadResult.secure_url);

      // ETAPA 3: Salvar produto no banco com a URL da imagem
      const result = await adicionarProduto({
        titulo: nome,
        descricao,
        preco,
        foto: uploadResult.secure_url
      }, triggerRefresh, showError);

      if (result.success) {
        // Limpa os campos
        (document.getElementById('input1') as HTMLInputElement).value = '';
        (document.getElementById('input2') as HTMLTextAreaElement).value = '';
        (document.getElementById('input3') as HTMLInputElement).value = '';

        showSuccess('Produto cadastrado com sucesso!');
        handleModalClose();
      }
    } catch (error) {
      showError('Erro interno ao cadastrar produto');
      console.error('Erro ao cadastrar produto:', error);
    } finally {
      setProcessing(false);
    }
  }; const handleSaveEditProduct = async () => {
    if (!produtoParaEditar) return;

    // Obter valores dos campos do modal de edição
    const nome = (document.getElementById('edit-input1') as HTMLInputElement)?.value?.trim();
    const descricao = (document.getElementById('edit-input2') as HTMLTextAreaElement)?.value?.trim();
    const precoStr = (document.getElementById('edit-input3') as HTMLInputElement)?.value?.trim();

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
      setProcessing(true);

      console.log('Etapa 1: Validando dados de edição no backend...');

      // ETAPA 1: Validar dados no backend
      const validationResult = await validarProduto({
        nome_produto: nome,
        descricao,
        preco,
        mensagem: `Produto: ${nome}`,
        ativo: true
      });

      if (!validationResult.success) {
        showError(validationResult.message);
        return;
      }

      let fotoUrl = produtoParaEditar.foto; // Mantém a foto atual por padrão

      // ETAPA 2: Se uma nova imagem foi selecionada, faz o upload
      if (selectedEditFile) {
        console.log('Etapa 2: Fazendo upload da nova imagem...');

        const uploadResult = await uploadImage(selectedEditFile);

        if (!uploadResult) {
          showError('Falha no upload da nova imagem');
          console.error('Falha no upload:', error);
          return;
        }

        console.log('Upload da nova imagem concluído!', uploadResult);
        fotoUrl = uploadResult.secure_url;
      }

      console.log('Etapa 3: Salvando produto editado no banco...');

      // ETAPA 3: Salva o produto editado no banco
      const result = await editarProduto(produtoParaEditar._id, {
        titulo: nome,
        descricao,
        preco,
        foto: fotoUrl
      }, triggerRefresh, showError);

      if (result.success) {
        showSuccess('Produto editado com sucesso!');
        handleEditModalClose();
      }
    } catch (error) {
      showError('Erro interno ao editar produto');
      console.error('Erro ao editar produto:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Loading state enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="bg-[#F9FAFB] dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9333EA] dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F9FAFB] dark:bg-gray-900 min-h-full">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
          {isAuthenticated && user ? (
            <>
              <CardSessao
                modo="logado"
                nomeUsuario={user.nome}
                nomeLoja={user.nomeLoja}
                id={user.id}
                mensagem={user.mensagem}
                fotoUsuario={user.fotoPerfil}
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
          texto: processing ? (validating ? "Validando..." : uploading ? "Enviando imagem..." : "Salvando...") : "Salvar",
          className: `${processing ? 'bg-gray-400' : 'bg-[#9333EA]'} text-white hover:bg-[#7C3AED]`,
          action: handleSaveProduct
        }}
        button2={{
          texto: "Cancelar",
          className: "bg-gray-300 text-gray-700 hover:bg-gray-400",
          action: () => { }
        }}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedFile={selectedFile}
        previewUrl={previewUrl}
        onFileSelect={handleFileSelect}
      />

      <Modal
        titulo="Editar Produto"
        button1={{
          texto: processing ? (uploading ? "Enviando imagem..." : "Salvando...") : "Salvar",
          className: `${processing ? 'bg-gray-400' : 'bg-[#9333EA]'} text-white hover:bg-[#7C3AED]`,
          action: handleSaveEditProduct
        }}
        button2={{
          texto: "Cancelar",
          className: "bg-gray-300 text-gray-700 hover:bg-gray-400",
          action: () => { }
        }}
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        defaultValues={{
          input1: produtoParaEditar?.titulo || '',
          input2: produtoParaEditar?.descricao || '',
          input3: produtoParaEditar?.preco?.toString() || ''
        }}
        inputIds={{
          input1: 'edit-input1',
          input2: 'edit-input2',
          input3: 'edit-input3'
        }}
        selectedFile={selectedEditFile}
        previewUrl={previewEditUrl || produtoParaEditar?.foto || null}
        onFileSelect={handleEditFileSelect}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
} 