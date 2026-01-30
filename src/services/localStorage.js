/**
 * Local Storage Helper
 * Substitui o DataStore do Android para salvar dados locais no navegador
 */

const KEYS = {
  FILE_LOADED: 'is_file_loaded',
  FIRST_ACCESS: 'if_first_access',
  ACCESS_TOKEN: 'access_token',
  USER_DATA: 'user_data',
  SCHEDULES: 'schedules'
};

const LocalStorageHelper = {
  /**
   * Verifica se o arquivo foi carregado
   */
  isFileLoaded() {
    return localStorage.getItem(KEYS.FILE_LOADED) === 'true';
  },

  /**
   * Define se o arquivo foi carregado
   */
  setFileLoaded(value) {
    localStorage.setItem(KEYS.FILE_LOADED, value ? 'true' : 'false');
  },

  /**
   * Obtém o token de acesso
   */
  getAccessToken() {
    return localStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  /**
   * Define o token de acesso
   */
  setAccessToken(token) {
    localStorage.setItem(KEYS.ACCESS_TOKEN, token);
  },

  /**
   * Verifica se é o primeiro acesso
   * Quando True, registra dados. Quando False, atualiza.
   */
  isFirstAccess() {
    const value = localStorage.getItem(KEYS.FIRST_ACCESS);
    return value === null || value === 'true';
  },

  /**
   * Define se é o primeiro acesso
   */
  setFirstAccess(value) {
    localStorage.setItem(KEYS.FIRST_ACCESS, value ? 'true' : 'false');
  },

  /**
   * Salva dados do usuário
   */
  setUserData(userData) {
    localStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
  },

  /**
   * Obtém dados do usuário
   */
  getUserData() {
    const data = localStorage.getItem(KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Salva os horários
   */
  setSchedules(schedules) {
    localStorage.setItem(KEYS.SCHEDULES, JSON.stringify(schedules));
  },

  /**
   * Obtém os horários
   */
  getSchedules() {
    const data = localStorage.getItem(KEYS.SCHEDULES);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Limpa todos os dados
   */
  clearAll() {
    Object.values(KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

export default LocalStorageHelper;
