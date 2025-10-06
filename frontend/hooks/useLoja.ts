"use client"
import apiClient from "@/apiClient"
import { useRouter } from "next/navigation"
import {useEffect, useState } from "react"

export interface Docs {
    _id: string,
    criador: {
        _id: string,
        nomeLoja: string,
        whatsapp: string,
        mensagem:string,
        fotoPerfil:string
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
        docs: Docs[], totalDocs: number;
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
    produtos: ProdutoResponsePaginate | undefined,
    getProdutos: (criador: string) => Promise<void>
}

export function useProdutosLoja(): LojaProdutoReturn {
    const [produtos, setProdutos] = useState<ProdutoResponsePaginate | undefined>(undefined)
    const [link, isSetLink] = useState<string>("")
    
    
    const router = useRouter()
    
    useEffect(() => {
        if(link){
            router.replace(link)
        }
    }, [link, router])

    async function getProdutos(criador: string): Promise<void> {
        try {
            const resposta = await apiClient<ProdutoResponsePaginate>({ url: `/produtos/usuario/${criador}` })
            if (resposta.status === 200) {
                setProdutos(resposta.data as ProdutoResponsePaginate)
            }
            const nomeLoja = resposta.data.data.docs[0].criador.nomeLoja.toLowerCase().replace(/ /g, "-")
            const id = resposta.data.data.docs[0].criador._id
            const linkCorreto = nomeLoja + '-' + id
            isSetLink(linkCorreto)
            
        } catch (erro) {
            console.error('getProduto Erro:', erro)
        }
    }
    return {
        produtos,
        getProdutos
    }
}