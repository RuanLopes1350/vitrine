export type typeUsuario = {
    nome: string,
    email: string,
    senha: string,
    whatsapp: string,
    ativo: boolean,
}

export type typeUsuarioCompleto = typeUsuario & {
    _id: string,
    data_cadastro: Date,
    data_ultima_atualizacao: Date,
}