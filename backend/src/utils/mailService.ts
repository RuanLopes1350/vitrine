export interface MailDataBemVindo {
    nomeSistema?: string;
    nome?: string;
    mensagem?: string;
    mensagemSecundaria?: string;
    itens?: string[];
    mostrarBotao?: boolean;
    textoBotao?: string;
    urlBotao?: string;
    corPrimaria?: string;
    corBotao?: string;
    corDestaque?: string;
    logoUrl?: string;
    infoAdicional?: string;
    textoFooter?: string;
    monstrarLinks?: boolean;
    linkSite?: string;
    linkSuporte?: string;
    linkPrivacidade?: string;
}

export interface MailDataGenerico {
    nomeSistema?: string;
    mostrarHeader?: boolean;
    logoUrl?: string;
    titulo?: string;
    subtitulo?: string;
    nome?: string;
    mensagem?: string;
    conteudo?: string;
    textoDestaque?: string;
    itens?: string[];
    dados?: string[];
    mostrarBotao?: boolean;
    textoBotao?: string;
    urlBotao?: string;
    mostrarBotaoSecundario?: boolean;
    textoBotaoSecundario?: string;
    urlBotaoSecundario?: string;
    nota?: string;
    infoAdicional?: string;
    corPrimaria?: string;
    corBotao?: string;
    corDestaque?: string;
    mostrarDivisor?: boolean;
    alinharTitulo?: string;
    textoFooter?: string;
    enderecoEmpresa?: string;
    mostrarLinks?: boolean
    linkSite?: string;
    linkSuporte?: string;
    linkPrivacidade?: string;
}

export interface SendMailParams {
    to: string;
    subject: string;
    template: string;
    data?: MailDataBemVindo | MailDataGenerico;
}

import axios from 'axios';
import 'dotenv/config'

export async function enviarEmail(email: SendMailParams) {
    try {
        const resposta = await axios.post(
            'http://localhost:5013/api/emails/send',
            email,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.MAIL_API_KEY
                }
            }
        )
        console.log(resposta.data)
    } catch (error:any) {
        console.error('Erro:', error.response?.data || error.message);
    }
}