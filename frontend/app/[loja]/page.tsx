"use client"
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useProdutosLoja } from "@/hooks/useLoja";
import { usePathname } from "next/navigation";
import { ShoppingBag, Loader2, Store, MessageCircle } from "lucide-react";
import ProdutoCardLoja from "@/components/produto-card-loja";

export default function PageLoja(){
    const {produtos, getProdutos} = useProdutosLoja();
    const [loading, setLoading] = useState(true);
    const local = usePathname();

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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {produtos.data.docs.map((produto) => (
                                <ProdutoCardLoja 
                                    key={produto._id} 
                                    produto={produto}
                                />
                            ))}
                        </div>
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