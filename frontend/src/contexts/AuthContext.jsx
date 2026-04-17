import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('votasim_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decoded);
          api.defaults.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, user } = response.data;
      
      localStorage.setItem('votasim_token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      console.error("Registration failed", err);
      throw err;
    }
  };

  const googleLogin = async (googleData) => {
    try {
      const response = await api.post('/auth/google', { googleData });
      const { token, user } = response.data;
      
      localStorage.setItem('votasim_token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      console.error("Google login failed", err);
      throw err;
    }
  };

  const updateUser = (data) => {
    setUser({ ...user, ...data });
  };

  const logout = () => {
    localStorage.removeItem('votasim_token');
    api.defaults.headers.Authorization = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, login, logout, register, googleLogin, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};