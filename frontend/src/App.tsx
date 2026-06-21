import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/ui/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ui/ProtectedRoute';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import PredictorPage from './pages/Predictor';
import BlogPage from './pages/Blog';
import AdminPage from './pages/Admin';
import NotFoundPage from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background text-text-primary">
                <Navbar />
                <main>
                  <Routes>
                    {/* Public */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/blog" element={<BlogPage />} />

                    {/* Protected */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/predictor" element={<PredictorPage />} />
                    </Route>

                    {/* Admin only */}
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminPage />} />
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}