import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { TodoList } from '@/features/todos/components/TodoList';
import { LoginForm } from '@/features/todos/components/LoginForm';
import { RegisterForm } from '@/features/todos/components/RegisterForm';
import { useAuthStore } from '@/features/auth/stores/authStore';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <TodoList />
    </MainLayout>
  );
};

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
};

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <RegisterForm />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
