// Tipos para os erros de validação do backend
export interface ValidationError {
  campo: string;
  mensagem: string;
}

export interface ApiErrorResponse {
  erro: boolean;
  code: number;
  mensagem: string;
  erros?: ValidationError[];
}

export interface ApiSuccessResponse<T = any> {
  code: number;
  mensagem: string;
  data: T;
}

// Função para extrair e formatar erros de validação
export function extractValidationErrors(error: any): {
  hasValidationErrors: boolean;
  validationErrors: ValidationError[];
  generalMessage: string;
} {
  console.log('Analisando erro:', error);

  // Verificar se é um erro HTTP com response
  if (error.response?.data) {
    const responseData = error.response.data as ApiErrorResponse;
    
    // Se tem erros de validação específicos
    if (responseData.erros && Array.isArray(responseData.erros) && responseData.erros.length > 0) {
      return {
        hasValidationErrors: true,
        validationErrors: responseData.erros,
        generalMessage: responseData.mensagem || 'Dados inválidos'
      };
    }
    
    // Se tem mensagem geral da API
    if (responseData.mensagem) {
      return {
        hasValidationErrors: false,
        validationErrors: [],
        generalMessage: responseData.mensagem
      };
    }
  }

  // Fallback para outros tipos de erro
  return {
    hasValidationErrors: false,
    validationErrors: [],
    generalMessage: error.message || 'Erro interno'
  };
}

// Função para formatar mensagens de erro para o usuário
export function formatErrorMessage(campo: string, mensagem: string): string {
  const campoMap: Record<string, string> = {
    'nome_produto': 'Nome do produto',
    'descricao': 'Descrição',
    'preco': 'Preço',
    'imagem': 'URL da imagem',
    'mensagem': 'Mensagem',
    'criador': 'Usuário',
    'nome': 'Nome',
    'nomeLoja': 'Nome da loja',
    'whatsapp': 'WhatsApp',
    'email': 'Email',
    'senha': 'Senha'
  };

  const campoFormatado = campoMap[campo] || campo;
  return `${campoFormatado}: ${mensagem}`;
}

// Função para mostrar erros de validação usando toast
export function showValidationErrors(
  validationErrors: ValidationError[],
  showError: (message: string) => void
) {
  validationErrors.forEach(erro => {
    const mensagemFormatada = formatErrorMessage(erro.campo, erro.mensagem);
    showError(mensagemFormatada);
  });
}

// Função principal para tratar erros da API
export function handleApiError(
  error: any,
  showError: (message: string) => void,
  defaultMessage: string = 'Erro interno'
): { success: false; message: string } {
  const { hasValidationErrors, validationErrors, generalMessage } = extractValidationErrors(error);

  if (hasValidationErrors) {
    // Mostrar todos os erros de validação
    showValidationErrors(validationErrors, showError);
    return { 
      success: false, 
      message: `${generalMessage}. Verifique os campos destacados.`
    };
  } else {
    // Mostrar erro geral
    const message = generalMessage || defaultMessage;
    showError(message);
    return { success: false, message };
  }
}