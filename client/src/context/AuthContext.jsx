import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on application load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await API.get('/auth/me');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await API.post('/auth/register', userData);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);