import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:1350/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token automaticamente nas requisições
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            if (!config.headers) {
                config.headers = {};
            }
            config.headers.Authorization = `Bearer ${token}`;
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
        // Se o token expirou ou é inválido (401), fazer logout
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;