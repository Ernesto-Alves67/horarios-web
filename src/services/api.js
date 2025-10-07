import axios from 'axios';
import LocalStorageHelper from './localStorage';

const BASE_URL = 'https://horarios-ufcat-api.vercel.app/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = LocalStorageHelper.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ApiService = {
  /**
   * Inicializa a sessão e obtém o token de acesso
   */
  async initAuth() {
    try {
      const response = await apiClient.post('/api/auth/init');
      return response.data;
    } catch (error) {
      console.error('Failed to initialize session:', error);
      throw error;
    }
  },

  /**
   * Registra um novo usuário
   */
  async registerUser(userData) {
    try {
      const response = await apiClient.post('/api/users', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  },

  /**
   * Atualiza dados do usuário
   */
  async updateUser(userData) {
    try {
      const response = await apiClient.put('/api/users', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  /**
   * Download de arquivo APK (não usado na versão web, mas mantido por compatibilidade)
   */
  async downloadApk(apkUrl) {
    try {
      const response = await apiClient.get(apkUrl, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to download APK:', error);
      throw error;
    }
  }
};

export default ApiService;
