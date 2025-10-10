import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Lista de rotas públicas que não precisam de autenticação
const rotasPublicas = [
    '/login',
    '/usuarios/senha/', // Rotas de recuperação de senha
    '/usuarios' // Rota de cadastro (POST)
];

// Função para verificar se a URL é pública
const isRotaPublica = (url: string): boolean => {
    return rotasPublicas.some(rota => url.includes(rota));
};

// Interceptor para adicionar token automaticamente nas requisições
apiClient.interceptors.request.use(
    (config) => {
        // Só adiciona o token se NÃO for uma rota pública
        if (!isRotaPublica(config.url || '')) {
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
        if (error.response?.status === 401 && !isRotaPublica(error.config?.url || '')) {
            console.log('Token inválido ou expirado. Redirecionando para login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;