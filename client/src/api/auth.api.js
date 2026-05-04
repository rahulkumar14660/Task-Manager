import api from './axios';

/**
 * Authentication API service
 */
const authAPI = {
  /**
   * Register a new user
   * @param {Object} data - { name, email, password, role }
   */
  signup: (data) => api.post('/auth/signup', data),

  /**
   * Login user
   * @param {Object} data - { email, password }
   */
  login: (data) => api.post('/auth/login', data),

  /**
   * Get current authenticated user profile
   */
  getMe: () => api.get('/auth/me'),
};

export default authAPI;
