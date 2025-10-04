export type typeProduto = {
    criador: string,
    nome_produto: string,
    descricao: string,
    preco: Number,
    imagem: string,
    ativo: boolean
}

export type typeProdutoEdicao = Partial<typeProduto>;