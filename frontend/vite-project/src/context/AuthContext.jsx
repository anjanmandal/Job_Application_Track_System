// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if logged in by calling /auth/me
    const fetchCurrentUser = async () => {
      try {
        const res = await API.get('/auth/me');
        console.log('in auth context',res.data)
        setUser(res.data.user);
      } catch (error) {
        console.error('Not authenticated');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    navigate('/dashboard');
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
