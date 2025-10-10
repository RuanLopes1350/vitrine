export type TypeEmailData = {
    nome: string;
    empresa: string;
    link?: string;
    codigo?: string;
}

export type TypeEmail = {
    to: string;
    subject: string;
    template: string;
    data: TypeEmailData;
}