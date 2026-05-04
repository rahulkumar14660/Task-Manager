import { createContext, useState, useEffect, useCallback } from 'react';
import authAPI from '../api/auth.api';

/**
 * Authentication Context
 * Provides user state and auth methods to the entire application
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /**
   * Fetch current user profile using stored token
   */
  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Token is invalid, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Auto-fetch user on mount and when token changes
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Login user with email and password
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    const response = await authAPI.login(credentials);
    const { user: userData, token: authToken } = response.data;

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);

    return response;
  };

  /**
   * Register a new user
   * @param {Object} userData - { name, email, password, role }
   */
  const signup = async (userData) => {
    const response = await authAPI.signup(userData);
    const { user: newUser, token: authToken } = response.data;

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    setToken(authToken);
    setUser(newUser);

    return response;
  };

  /**
   * Logout current user
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isMember: user?.role === 'member',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
