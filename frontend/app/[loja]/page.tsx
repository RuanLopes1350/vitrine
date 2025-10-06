"use client"
import { useEffect, useMemo, useState } from "react";
import { useProdutosLoja } from "@/hooks/useLoja";
import { usePathname } from "next/navigation";
import { ShoppingBag, Loader2, Store, MessageCircle } from "lucide-react";
import ProdutoCardLoja from "@/components/produto-card-loja";
import { useTheme } from "@/contexts/ThemeContext";

// Configuração para permitir rotas dinâmicas não pré-renderizadas
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function PageLoja() {
    const { produtos, getProdutos } = useProdutosLoja();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [isNomeLoja, setIsNomeLoja] = useState<string>()
    const [isMensagemLoja, setIsMensagemLoja] = useState<string>()
    const [isFotoPerfil, setIsFotoPerfil] = useState<string>()
    const local = usePathname();
    const [itemsPerPage, setIsItemsPerPage] = useState<number>(20)
    const [currentPage, setCurrentPage] = useState<number>(0)

    // CORRETO: Calcular valores derivados sem estado
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = produtos?.data.docs.slice(startIndex, endIndex) || [];
    const totalPages = produtos?.data.docs ? Math.ceil(produtos.data.docs.length / itemsPerPage) : 0;

    useEffect(() => {
        async function carregarProdutos() {
            setLoading(true);
            const id = local.match(/[0-9a-fA-F]{24}/)?.[0] as string;

            if (id) {
                await getProdutos(id);
            }
            setLoading(false);
        }

        carregarProdutos();
    }, [local]);

    useEffect(() => {
        if (produtos?.data?.docs && produtos.data.docs.length > 0) {
            const nomeLoja = produtos.data.docs[0].criador.nomeLoja;
            const mensagemLoja = produtos.data.docs[0].criador.mensagem
            const fotoPerfil = produtos.data.docs[0].criador.fotoPerfil
            setIsNomeLoja(nomeLoja);
            setIsMensagemLoja(mensagemLoja)
            setIsFotoPerfil(fotoPerfil)
            console.log(nomeLoja)
        } else {
            setIsNomeLoja("Loja não encontrada");
        }
    }, [produtos]);

    function nextPage() {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1)
        }
    }

    function prevPage() {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1)
        }
    }

    function goToPage(page: number) {
        setCurrentPage(page);
    }
    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#9333EA] dark:text-purple-400" />
                            <span className="ml-3 text-gray-600 dark:text-gray-300">Carregando loja...</span>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
    // Verificar se há produtos
    const temProdutos = produtos?.data?.docs && produtos.data.docs.length > 0;
    const nomeLoja = temProdutos ? produtos.data.docs[0].criador.nomeLoja : "Loja não encontrada";
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header da vitrine */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-8 mb-4 sm:mb-8">
                    <div className="flex flex-col items-center">
                        {isFotoPerfil ? (
                            <img
                                src={isFotoPerfil}
                                alt="Logo da loja"
                                draggable='false'
                                className="h-[96px] w-[96px] sm:h-[128px] sm:w-[128px] rounded-full object-cover border-2 border-[#9333EA] mb-[10px]"
                            />
                        ) : (
                            <div className="h-[48px] w-[48px] sm:h-[128px] sm:w-[128px] bg-[#F3E8FF] rounded-full flex justify-center items-center mb-[10px]">
                                <img src="/Vitrine.svg" alt="" className="w-6 sm:w-auto" />
                            </div>
                        )}

                        <h1 className="text-[20px] sm:text-[26px] font-bold text-center max-w-full break-words mt-2 text-gray-900 dark:text-gray-100">Bem-vindo a {isNomeLoja} </h1>
                        <p className="max-w-full overflow-hidden text-[#4B5563] dark:text-gray-400 text-center text-sm sm:text-base px-2 break-words">{isMensagemLoja}</p>
                        {/* <p className="text-[#4B5563] text-center text-sm sm:text-base px-2">Crie sua loja hoje mesmo e comece a vender em minutos!</p> */}
                    </div>
                </section>

                {/* Seção da loja */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-8">
                    {/* Header da loja */}
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-[#F3E8FF] dark:bg-purple-900/30 p-3 rounded-lg border border-[#E9D5FF] dark:border-purple-700">
                            <Store className="h-6 w-6 text-[#9333EA] dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#111827] dark:text-gray-100">{nomeLoja}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {temProdutos
                                    ? `${produtos.data.docs.length} produto${produtos.data.docs.length !== 1 ? 's' : ''} disponível${produtos.data.docs.length !== 1 ? 'eis' : ''}`
                                    : "Nenhum produto encontrado"
                                }
                            </p>
                        </div>
                    </div>

                    {/* Grid de produtos */}
                    {temProdutos ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {currentItems.map((produto) => (
                                    <ProdutoCardLoja
                                        key={produto._id}
                                        produto={produto}
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
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === index
                                                        ? 'text-white bg-[#9333EA] dark:bg-purple-600'
                                                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer'
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
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                        /* Estado vazio */
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl mx-auto mb-6 flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
                                Nenhum produto encontrado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                                Esta loja ainda não possui produtos cadastrados ou a loja não foi encontrada.
                            </p>
                        </div>
                    )}

                    {/* Footer da loja - informações adicionais */}
                    {temProdutos && (
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="bg-gradient-to-r from-[#F3E8FF] to-[#EDE9FE] dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="bg-[#9333EA] dark:bg-purple-600 p-2 rounded-lg">
                                        <MessageCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Entre em contato
                                    </h3>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Clique no botão "WhatsApp" em qualquer produto para entrar
                                    em contato direto com <strong>{nomeLoja}</strong> e tirar suas dúvidas.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}