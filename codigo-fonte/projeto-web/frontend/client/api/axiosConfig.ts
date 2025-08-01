import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', // URL base da sua API
});

// Adiciona um interceptador para incluir o token em todas as requisições
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;