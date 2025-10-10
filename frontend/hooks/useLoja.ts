"use client"
import apiClient from "@/apiClient"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"

export interface Docs {
    _id: string,
    criador: {
        _id: string,
        nomeLoja: string,
        whatsapp: string,
        mensagem: string,
        fotoPerfil: string
    },
    nome_produto: string,
    descricao: string,
    mensagem: string,
    imagem: string,
    preco: number,
    ativo: boolean
}

interface ProdutoResponsePaginate {
    success: boolean;
    code: number;
    data: {
        docs: Docs[];
        totalDocs: number;
        limit: number;
        totalPages: number;
        page: number;
        pagingCounter: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    };
    message?: string;
}

interface LojaProdutoReturn {
    produtos: ProdutoResponsePaginate | undefined;
    loading: boolean;
    error: string | null;
    currentPage: number;
    getProdutos: (criador: string, page?: number, limit?: number) => Promise<void>;
    setPage: (page: number) => void;
    clearCache: () => void;
}

const SESSION_STORAGE_KEY = 'loja_produtos_cache';
const SESSION_STORAGE_EXPIRY = 5 * 60 * 1000; // 5 minutos

interface CachedData {
    data: ProdutoResponsePaginate;
    timestamp: number;
    criadorId: string;
    page: number;
}

export function useProdutosLoja(): LojaProdutoReturn {
    const [produtos, setProdutos] = useState<ProdutoResponsePaginate | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [link, isSetLink] = useState<string>("")

    const router = useRouter()

    useEffect(() => {
        if (link) {
            router.replace(link)
        }
    }, [link, router])

    // Função para salvar no sessionStorage
    const saveToSessionStorage = useCallback((criadorId: string, page: number, data: ProdutoResponsePaginate) => {
        try {
            const cacheKey = `${SESSION_STORAGE_KEY}_${criadorId}_page_${page}`;
            const cachedData: CachedData = {
                data,
                timestamp: Date.now(),
                criadorId,
                page
            };
            sessionStorage.setItem(cacheKey, JSON.stringify(cachedData));
        } catch (erro) {
            console.warn('Erro ao salvar no sessionStorage:', erro);
        }
    }, []);

    // Função para ler do sessionStorage
    const getFromSessionStorage = useCallback((criadorId: string, page: number): ProdutoResponsePaginate | null => {
        try {
            const cacheKey = `${SESSION_STORAGE_KEY}_${criadorId}_page_${page}`;
            const cached = sessionStorage.getItem(cacheKey);

            if (!cached) return null;

            const cachedData: CachedData = JSON.parse(cached);

            // Verifica se o cache expirou
            if (Date.now() - cachedData.timestamp > SESSION_STORAGE_EXPIRY) {
                sessionStorage.removeItem(cacheKey);
                return null;
            }

            return cachedData.data;
        } catch (erro) {
            console.warn('Erro ao ler do sessionStorage:', erro);
            return null;
        }
    }, []);

    // Função para limpar cache
    const clearCache = useCallback(() => {
        try {
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith(SESSION_STORAGE_KEY)) {
                    sessionStorage.removeItem(key);
                }
            });
        } catch (erro) {
            console.warn('Erro ao limpar cache:', erro);
        }
    }, []);

    // Função para buscar produtos
    const getProdutos = useCallback(async (criador: string, page: number = 1, limit: number = 20): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Tenta buscar do cache primeiro
            const cachedData = getFromSessionStorage(criador, page);
            if (cachedData) {
                console.log('Produtos carregados do cache (sessionStorage)');
                setProdutos(cachedData);
                setCurrentPage(page);
                setLoading(false);
                return;
            }

            // Se não encontrou no cache, busca da API
            console.log('Buscando produtos da API...');
            const url = `/produtos/usuario/${criador}?page=${page}&limit=${limit}`;
            const resposta = await apiClient.get<ProdutoResponsePaginate>(url);

            if (resposta.status === 200 && resposta.data) {
                setProdutos(resposta.data);
                setCurrentPage(page);

                // Salva no sessionStorage
                saveToSessionStorage(criador, page, resposta.data);

                // Atualiza o link da loja se tiver produtos
                if (resposta.data.data.docs && resposta.data.data.docs.length > 0) {
                    const nomeLoja = resposta.data.data.docs[0].criador.nomeLoja
                        .toLowerCase()
                        .replace(/ /g, "-");
                    const id = resposta.data.data.docs[0].criador._id;
                    const linkCorreto = `${nomeLoja}-${id}`;
                    isSetLink(linkCorreto);
                }
            } else {
                setError('Erro ao carregar produtos');
            }
        } catch (erro: any) {
            console.error('getProduto Erro:', erro);
            setError(erro?.response?.data?.message || 'Erro ao carregar produtos da loja');
            setProdutos(undefined);
        } finally {
            setLoading(false);
        }
    }, [getFromSessionStorage, saveToSessionStorage]);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    return {
        produtos,
        loading,
        error,
        currentPage,
        getProdutos,
        setPage,
        clearCache
    }
}