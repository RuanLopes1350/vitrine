export type typeUsuario = {
    nome: string,
    nomeLoja: string,
    whatsapp: string,
    email: string,
    senha: string,
    fotoPerfil?: string,
    mensagem?: string,
    ativo: boolean,
    accessToken?: string
}

export type typeUsuarioCompleto = typeUsuario & {
    _id: string,
    data_cadastro: Date,
    data_ultima_atualizacao: Date,
}