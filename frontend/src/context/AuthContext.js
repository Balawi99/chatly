import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api/auth';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.data.user);
        } catch (err) {
          console.error('Error fetching user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRegister(userData);
      const { token, user } = response.data;
      
      // Save token and user data
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiLogin(credentials);
      const { token, user } = response.data;
      
      // Save token and user data
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout a user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update user data in context
  const updateUserData = (newUserData) => {
    setUser(prevUser => ({ ...prevUser, ...newUserData }));
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateUserData,
    isAuthenticated: !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 