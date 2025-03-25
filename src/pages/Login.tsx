
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 w-96 h-96 bg-indigo-400/10 rounded-full filter blur-3xl" />
      </div>
      
      <div className="relative w-full max-w-md z-10 animate-fade-in">
        <AuthForm />
      </div>
    </div>
  );
};

export default Login;
