import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/users/profile');
        if (res.data.user) {
          setIsAuth(true);
        }
      } catch (err) {
        setIsAuth(false);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return isAuth ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
