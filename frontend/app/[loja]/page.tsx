"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Docs, useProdutosLoja } from "@/hooks/useLoja";
import { usePathname } from "next/navigation";
import { ShoppingBag, Loader2, Store, MessageCircle } from "lucide-react";
import ProdutoCardLoja from "@/components/produto-card-loja";

export default function PageLoja() {
    const { produtos, getProdutos } = useProdutosLoja();
    const [loading, setLoading] = useState(true);
    const local = usePathname();
    const [itemsPerPage, setIsItemsPerPage] = useState<number>(2)
    const [currentPage, setCurrentPage] = useState<number>(0)
    
    // ✅ CORRETO: Calcular valores derivados sem estado
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
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <section className="bg-white rounded-xl shadow-md p-8">
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#9333EA]" />
                            <span className="ml-3 text-gray-600">Carregando loja...</span>
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header da vitrine */}
                <section className="bg-white rounded-xl shadow-md p-8 mb-8">
                    <div className="flex flex-col items-center">
                        <div className="h-[64px] w-[64px] bg-[#F3E8FF] rounded-full flex justify-center items-center mb-[10px]">
                            <img src="Vitrine.svg" alt="" />
                        </div>
                        <h1 className="text-[26px] font-bold">Bem-vindo a Vitrine</h1>
                        <p className="text-[#4B5563] text-center">A maneira mais fácil de mostrar seus produtos e se conectar com clientes diretamente pelo WhatsApp.</p>
                        <p className="text-[#4B5563] text-center">Crie sua loja hoje mesmo e comece a vender em minutos!</p>
                    </div>
                </section>

                {/* Seção da loja */}
                <section className="bg-white rounded-xl shadow-md p-8">
                    {/* Header da loja */}
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="bg-[#F3E8FF] p-3 rounded-lg border border-[#E9D5FF]">
                            <Store className="h-6 w-6 text-[#9333EA]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-[#111827]">{nomeLoja}</h1>
                            <p className="text-gray-600 mt-1">
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
                        /* Estado vazio */
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl mx-auto mb-6 flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-3">
                                Nenhum produto encontrado
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                                Esta loja ainda não possui produtos cadastrados ou a loja não foi encontrada.
                            </p>
                        </div>
                    )}

                    {/* Footer da loja - informações adicionais */}
                    {temProdutos && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="bg-gradient-to-r from-[#F3E8FF] to-[#EDE9FE] rounded-lg p-6">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="bg-[#9333EA] p-2 rounded-lg">
                                        <MessageCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Entre em contato
                                    </h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
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