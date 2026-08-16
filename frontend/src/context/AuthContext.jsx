import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const access_token = localStorage.getItem('access_token');
      const refresh_token = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user');

      if (access_token && refresh_token) {
        setTokens({ access: access_token, refresh: refresh_token });
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            const decoded = decodeToken(access_token);
            if (decoded) setUser(decoded);
        }
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const response = await loginUser({ username, password });
    const { access, refresh } = response.data;
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    const decodedUser = decodeToken(access);
    const userData = response.data.user || {
      username: decodedUser?.username || username,
      ...(decodedUser || {}),
    };
    localStorage.setItem('user', JSON.stringify(userData));
    
    setTokens({ access, refresh });
    setUser(userData);
    setIsAuthenticated(true);
    return response.data;
  };

  const register = async (username, email, password, confirmPassword) => {
    const response = await registerUser({ username, email, password, confirm_password: confirmPassword });
    // Assuming register might auto-login or we just login after
    await login(username, password);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, tokens, token: tokens?.access, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
