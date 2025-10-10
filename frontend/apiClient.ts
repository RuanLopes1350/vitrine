import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Função para verificar se a rota é pública (não precisa de token)
const isRotaPublica = (url: string, method: string = 'GET'): boolean => {
    const urlUpper = url.toUpperCase();
    const methodUpper = method.toUpperCase();
    
    // Rotas de autenticação
    if (url.includes('/login')) return true;
    
    // Rotas de recuperação de senha
    if (url.includes('/usuarios/senha/')) return true;
    
    // IMPORTANTE: Apenas POST para /usuarios é público (cadastro)
    // PATCH, GET, DELETE para /usuarios/:id são protegidos
    if (url === '/usuarios' && methodUpper === 'POST') return true;
    
    return false;
};

// Interceptor para adicionar token automaticamente nas requisições
apiClient.interceptors.request.use(
    (config) => {
        // Só adiciona o token se NÃO for uma rota pública
        if (!isRotaPublica(config.url || '', config.method || 'GET')) {
            const token = localStorage.getItem('token');
            if (token) {
                if (!config.headers) {
                    config.headers = {};
                }
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas e logout automático
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Só redireciona para login se NÃO for uma rota pública
        if (error.response?.status === 401 && !isRotaPublica(error.config?.url || '', error.config?.method || 'GET')) {
            console.log('Token inválido ou expirado. Redirecionando para login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;