"use client";

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { handleApiError } from '@/lib/errorHandling';

export interface Produto {
    _id: string;
    titulo: string;
    descricao: string;
    preco: number;
    foto: string;
    usuarioId: string;
    whatsapp?: string;
}

interface ProdutoBackend {
    _id?: string;
    nome_produto: string;
    descricao: string;
    preco: number;
    imagem?: string;
    criador?: string | {
        _id: string;
        whatsapp: string;
    };
    mensagem: string;
    ativo: boolean;
}

interface ProdutoResponse {
    success: boolean;
    code: number;
    data: ProdutoBackend[] | ProdutoBackend;
    message?: string;
}

interface UseProdutosReturn {
    produtos: Produto[];
    loading: boolean;
    error: string | null;
    buscarProdutos: () => Promise<void>;
    buscarProdutosPorUsuario: () => Promise<void>;
    adicionarProduto: (
        produto: Omit<Produto, '_id' | 'usuarioId'>,
        refreshCallback?: () => void,
        showError?: (message: string) => void
    ) => Promise<{ success: boolean; message: string }>;
    editarProduto: (
        id: string,
        produto: Omit<Produto, '_id' | 'usuarioId'>,
        refreshCallback?: () => void,
        showError?: (message: string) => void
    ) => Promise<{ success: boolean; message: string }>;
    deletarProduto: (id: string, showError?: (message: string) => void) => Promise<{ success: boolean; message: string }>;
}

export function useProdutos(): UseProdutosReturn {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const buscarProdutos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get<ProdutoResponse>('/produtos');

            if (response.data.code === 200 && Array.isArray(response.data.data)) {
                const produtosMapeados = response.data.data
                    .filter(item => item.ativo && item._id)
                    .map(item => {
                        const criadorObj = typeof item.criador === 'object' ? item.criador : null;
                        return {
                            _id: item._id!,
                            titulo: item.nome_produto || '',
                            descricao: item.descricao || '',
                            preco: Number(item.preco) || 0,
                            foto: item.imagem || '/placeholder-image.png',
                            usuarioId: typeof item.criador === 'string' ? item.criador : item.criador?._id || '',
                            whatsapp: criadorObj?.whatsapp
                        };
                    });

                setProdutos(produtosMapeados);
            } else {
                console.warn('Resposta inesperada da API:', response.data);
                setProdutos([]);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            setError('Erro ao carregar produtos');
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarProdutosPorUsuario = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user?.id) {
                setError('Usuário não autenticado');
                setProdutos([]);
                return;
            }

            // Usar a rota específica para buscar produtos do usuário com paginação
            // Usando limit=1000 para pegar todos os produtos (ajustar conforme necessidade)
            const response = await apiClient.get<any>(`/produtos/usuario/${user.id}?page=1&limit=1000`);

            console.log('Resposta completa da API:', {
                totalDocs: response.data.data?.totalDocs,
                docsRetornados: response.data.data?.docs?.length,
                limit: response.data.data?.limit,
                page: response.data.data?.page,
                totalPages: response.data.data?.totalPages
            });

            if (response.data.code === 200 && response.data.data?.docs) {
                // Contar produtos ativos e inativos
                const todosOsProdutos = response.data.data.docs;
                const produtosAtivos = todosOsProdutos.filter((item: any) => item.ativo);
                const produtosInativos = todosOsProdutos.filter((item: any) => !item.ativo);

                console.log(`📊 Estatísticas dos produtos:`);
                console.log(`   Total no banco: ${response.data.data.totalDocs}`);
                console.log(`   Retornados pela API: ${todosOsProdutos.length}`);
                console.log(`   ✅ Ativos: ${produtosAtivos.length}`);
                console.log(`   ❌ Inativos: ${produtosInativos.length}`);

                // Mapear APENAS produtos ativos
                const produtosMapeados = todosOsProdutos
                    .filter((item: any) => item.ativo && item._id)
                    .map((item: any) => {
                        const criadorObj = typeof item.criador === 'object' ? item.criador : null;
                        return {
                            _id: item._id!,
                            titulo: item.nome_produto || '',
                            descricao: item.descricao || '',
                            preco: Number(item.preco) || 0,
                            foto: item.imagem || '/placeholder-image.png',
                            usuarioId: typeof item.criador === 'string' ? item.criador : item.criador?._id || '',
                            whatsapp: criadorObj?.whatsapp
                        };
                    });

                console.log(`✨ Produtos carregados para exibição: ${produtosMapeados.length}`);
                setProdutos(produtosMapeados);
            } else {
                console.warn('Resposta inesperada da API:', response.data);
                setProdutos([]);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos do usuário:', error);
            setError('Erro ao carregar seus produtos');
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const adicionarProduto = async (
        produto: Omit<Produto, '_id' | 'usuarioId'>,
        refreshCallback?: () => void,
        showError?: (message: string) => void
    ) => {
        try {
            setLoading(true);
            setError(null);

            const produtoBackend: Omit<ProdutoBackend, '_id' | 'criador'> = {
                nome_produto: produto.titulo.trim(),
                descricao: produto.descricao.trim(),
                preco: produto.preco,
                mensagem: `Produto: ${produto.titulo}`,
                ativo: true
            };

            if (produto.foto && produto.foto.trim() && produto.foto.startsWith('http')) {
                produtoBackend.imagem = produto.foto.trim();
            }

            const response = await apiClient.post<ProdutoResponse>('/produtos', produtoBackend);

            if (response.data.code === 201) {
                // Chama o callback para refresh se fornecido
                if (refreshCallback) {
                    refreshCallback();
                }
                return { success: true, message: 'Produto adicionado com sucesso!' };
            } else {
                throw new Error(response.data.message || 'Erro ao adicionar produto');
            }
        } catch (error: any) {
            if (showError) {
                return handleApiError(error, showError, 'Erro ao adicionar produto');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Erro ao adicionar produto';
                setError(errorMessage);
                return { success: false, message: errorMessage };
            }
        } finally {
            setLoading(false);
        }
    };

    const editarProduto = async (
        id: string,
        produto: Omit<Produto, '_id' | 'usuarioId'>,
        refreshCallback?: () => void,
        showError?: (message: string) => void
    ) => {
        try {
            setLoading(true);
            setError(null);

            const produtoBackend: Partial<ProdutoBackend> = {
                nome_produto: produto.titulo.trim(),
                descricao: produto.descricao.trim(),
                preco: produto.preco,
                mensagem: `Produto: ${produto.titulo}`,
                ativo: true
            };

            if (produto.foto && produto.foto.trim() && produto.foto.startsWith('http')) {
                produtoBackend.imagem = produto.foto.trim();
            }

            const response = await apiClient.patch<ProdutoResponse>(`/produtos/${id}`, produtoBackend);

            if (response.data.code === 200) {
                // Chama o callback para refresh se fornecido
                if (refreshCallback) {
                    refreshCallback();
                }
                return { success: true, message: 'Produto atualizado com sucesso!' };
            } else {
                throw new Error(response.data.message || 'Erro ao editar produto');
            }
        } catch (error: any) {
            if (showError) {
                return handleApiError(error, showError, 'Erro ao editar produto');
            } else {
                // Fallback para compatibilidade
                const errorMessage = error.response?.data?.message || error.message || 'Erro ao editar produto';
                setError(errorMessage);
                return { success: false, message: errorMessage };
            }
        } finally {
            setLoading(false);
        }
    };

    const deletarProduto = async (id: string, showError?: (message: string) => void) => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.delete<ProdutoResponse>(`/produtos/${id}`);

            if (response.data.code === 200) {
                setProdutos(prevProdutos => prevProdutos.filter(p => p._id !== id));
                return { success: true, message: 'Produto excluído com sucesso!' };
            } else {
                throw new Error(response.data.message || 'Erro ao excluir produto');
            }
        } catch (error: any) {
            // Se o produto não foi encontrado (404/422), remove da lista mesmo assim
            if (error.response?.status === 404 || error.response?.status === 422) {
                setProdutos(prevProdutos => prevProdutos.filter(p => p._id !== id));
                return { success: true, message: 'Produto removido da lista!' };
            }

            if (showError) {
                return handleApiError(error, showError, 'Erro ao excluir produto');
            } else {
                // Fallback para compatibilidade
                const errorMessage = error.response?.data?.message || error.message || 'Erro ao excluir produto';
                setError(errorMessage);
                return { success: false, message: errorMessage };
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        produtos,
        loading,
        error,
        buscarProdutos,
        buscarProdutosPorUsuario,
        adicionarProduto,
        editarProduto,
        deletarProduto,
    };
}