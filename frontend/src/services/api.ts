import axios from 'axios';

const api = axios.create({
  // O proxy do Vite irá tratar de redirecionar isto para http://api-node:5200
  baseURL: '/',
});

// Intercetor de Requisição: Anexa o token JWT
api.interceptors.request.use(
  (config) => {
    // Idealmente, o token seria guardado num cookie httpOnly,
    // mas para este projeto, vamos usar o localStorage.
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercetor de Resposta: Trata de erros globais (ex: 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      // Recarrega a página para o router redirecionar para /login
      // Uma solução mais elegante usaria o gestor de estado (Zustand).
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
