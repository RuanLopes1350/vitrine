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
  const [refreshKey, setRefreshKey] = useState(0);
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { uploadImage, uploading, error } = useCloudinaryUpload();
  const { validarProduto, validating } = useProdutoValidation();

  // Estados para controle do loading geral (validação + upload)
  const [processing, setProcessing] = useState(false);

  // ===== ESTADOS PARA MODAL DE CADASTRO =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ===== ESTADOS PARA MODAL DE EDIÇÃO =====
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null);
  const [produtoEditando, setProdutoEditando] = useState({
    nome: '',
    descricao: '',
    preco: ''
  });
  const [selectedEditFile, setSelectedEditFile] = useState<File | null>(null);
  const [previewEditUrl, setPreviewEditUrl] = useState<string | null>(null);

  // ===== FUNÇÕES AUXILIARES =====
  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // ===== HANDLERS DO MODAL DE CADASTRO =====
  const handleNovoProdutoChange = (campo: 'nome' | 'descricao' | 'preco', valor: string) => {
    setNovoProduto(prev => ({ ...prev, [campo]: valor }));
  };

  const handleFileSelect = (file: File, preview: string) => {
    setSelectedFile(file);
    setPreviewUrl(preview);
  };

  const handleAddProduct = () => {
    // Limpar formulário ao abrir
    setNovoProduto({ nome: '', descricao: '', preco: '' });
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(false);
  };

  // ===== HANDLERS DO MODAL DE EDIÇÃO =====
  const handleProdutoEditandoChange = (campo: 'nome' | 'descricao' | 'preco', valor: string) => {
    setProdutoEditando(prev => ({ ...prev, [campo]: valor }));
  };

  const handleEditFileSelect = (file: File, preview: string) => {
    setSelectedEditFile(file);
    setPreviewEditUrl(preview);
  };

  const handleEditProduct = (produto: Produto) => {
    setProdutoParaEditar(produto);
    // Preencher formulário de edição
    setProdutoEditando({
      nome: produto.titulo,
      descricao: produto.descricao,
      preco: produto.preco.toString()
    });
    setSelectedEditFile(null);
    setPreviewEditUrl(null);
    setIsEditModalOpen(true);
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

  // ===== FUNÇÃO DE SALVAR NOVO PRODUTO (REFATORADA) =====
  const handleSaveProduct = async () => {
    // Validações usando estados controlados
    if (!novoProduto.nome.trim()) {
      showError('Nome do produto é obrigatório');
      return;
    }

    if (!novoProduto.descricao.trim()) {
      showError('Descrição é obrigatória');
      return;
    }

    if (!novoProduto.preco.trim()) {
      showError('Preço é obrigatório');
      return;
    }

    const preco = parseFloat(novoProduto.preco);
    if (isNaN(preco) || preco <= 0) {
      showError('Preço deve ser um número válido e maior que zero');
      return;
    }

    if (!selectedFile) {
      showError('Selecione uma imagem para o produto');
      return;
    }

    try {
      setProcessing(true);

      // ETAPA 1: Validar dados no backend
      const validationResult = await validarProduto({
        nome_produto: novoProduto.nome.trim(),
        descricao: novoProduto.descricao.trim(),
        preco,
        mensagem: `Produto: ${novoProduto.nome}`,
        ativo: true
      });

      if (!validationResult.success) {
        showError(validationResult.message);
        return;
      }

      // ETAPA 2: Upload da imagem para Cloudinary
      const uploadResult = await uploadImage(selectedFile);

      if (!uploadResult) {
        showError('Falha no upload da imagem');
        return;
      }

      // ETAPA 3: Salvar produto no banco
      const result = await adicionarProduto({
        titulo: novoProduto.nome.trim(),
        descricao: novoProduto.descricao.trim(),
        preco,
        foto: uploadResult.secure_url
      }, triggerRefresh, showError);

      if (result.success) {
        showSuccess('Produto cadastrado com sucesso!');
        handleModalClose();
      }
    } catch (error) {
      showError('Erro interno ao cadastrar produto');
      console.error('Erro ao cadastrar produto:', error);
    } finally {
      setProcessing(false);
    }
  };  // ===== FUNÇÃO DE EDITAR PRODUTO (REFATORADA) =====
  const handleSaveEditProduct = async () => {
    if (!produtoParaEditar) return;

    // Validações usando estados controlados
    if (!produtoEditando.nome.trim()) {
      showError('Nome do produto é obrigatório');
      return;
    }

    if (!produtoEditando.descricao.trim()) {
      showError('Descrição é obrigatória');
      return;
    }

    if (!produtoEditando.preco.trim()) {
      showError('Preço é obrigatório');
      return;
    }

    const preco = parseFloat(produtoEditando.preco);
    if (isNaN(preco) || preco <= 0) {
      showError('Preço deve ser um número válido e maior que zero');
      return;
    }

    try {
      setProcessing(true);

      // ETAPA 1: Validar dados
      const validationResult = await validarProduto({
        nome_produto: produtoEditando.nome.trim(),
        descricao: produtoEditando.descricao.trim(),
        preco,
        mensagem: `Produto: ${produtoEditando.nome}`,
        ativo: true
      });

      if (!validationResult.success) {
        showError(validationResult.message);
        return;
      }

      let fotoUrl = produtoParaEditar.foto;

      // ETAPA 2: Upload de nova imagem (se houver)
      if (selectedEditFile) {
        const uploadResult = await uploadImage(selectedEditFile);

        if (!uploadResult) {
          showError('Falha no upload da nova imagem');
          return;
        }

        fotoUrl = uploadResult.secure_url;
      }

      // ETAPA 3: Salvar edição
      const result = await editarProduto(produtoParaEditar._id, {
        titulo: produtoEditando.nome.trim(),
        descricao: produtoEditando.descricao.trim(),
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
                fotoUsuario={user.fotoPerfil}
                id={user.id}
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
        formValues={novoProduto}
        onFormChange={handleNovoProdutoChange}
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
        formValues={produtoEditando}
        onFormChange={handleProdutoEditandoChange}
        selectedFile={selectedEditFile}
        previewUrl={previewEditUrl || produtoParaEditar?.foto || null}
        onFileSelect={handleEditFileSelect}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
} 