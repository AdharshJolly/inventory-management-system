import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          // Verify token by calling /auth/me
          const response = await api.get('/auth/me');
          setState({
            user: response.data,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
