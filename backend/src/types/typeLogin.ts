// Dados necessários para realizar login
export interface DadosLogin {
  email: string;
  senha: string;
}

// Dados retornados após login bem-sucedido
export interface RespostaLogin {
  token: string;
  usuario: {
    id: string;
    nome: string;
    nomeLoja: string;
    email: string;
    whatsapp: string;
    ativo: boolean;
  };
}

// Payload do token JWT
export interface PayloadToken {
  id: string;
  email: string;
}