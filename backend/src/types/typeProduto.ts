export type typeProduto = {
    criador: string,
    nome_produto: string,
    descricao: string,
    preco: Number,
    imagem: string,
    ativo: boolean,
    mensagem: string
}

export type typeProdutoEdicao = Partial<typeProduto>;