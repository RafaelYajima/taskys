
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

type AuthCheckProps = {
  children: React.ReactNode;
  requireAuth?: boolean;
};

const PUBLIC_ROUTES = ['/login', '/register'];

const AuthCheck: React.FC<AuthCheckProps> = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated && !PUBLIC_ROUTES.includes(location.pathname)) {
      navigate('/login');
    }

    // If user is authenticated but tries to access login/register pages
    if (isAuthenticated && PUBLIC_ROUTES.includes(location.pathname)) {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate, requireAuth]);

  return <>{children}</>;
};

export default AuthCheck;
