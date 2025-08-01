import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import PDV from "./pages/PDV";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Determinar rota inicial baseada no cargo do usuário
  const getDefaultRoute = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'estoquista':
        return '/';
      case 'vendedor':
        return '/pdv';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      {/* Redirecionar login para página inicial se já autenticado */}
      <Route path="/login" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* Rotas do Estoquista */}
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRoute="/">
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produtos"
        element={
          <ProtectedRoute requiredRoute="/produtos">
            <Placeholder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estoque"
        element={
          <ProtectedRoute requiredRoute="/estoque">
            <Placeholder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/fornecedores"
        element={
          <ProtectedRoute requiredRoute="/fornecedores">
            <Placeholder />
          </ProtectedRoute>
        }
      />

      {/* Rotas do Vendedor */}
      <Route
        path="/pdv"
        element={
          <ProtectedRoute requiredRoute="/pdv">
            <PDV />
          </ProtectedRoute>
        }
      />

      {/* Rotas do Administrador */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRoute="/admin">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute requiredRoute="/usuarios">
            <Usuarios />
          </ProtectedRoute>
        }
      />
      <Route
        path="/relatorios"
        element={
          <ProtectedRoute requiredRoute="/relatorios">
            <Placeholder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/configuracoes"
        element={
          <ProtectedRoute requiredRoute="/configuracoes">
            <Placeholder />
          </ProtectedRoute>
        }
      />

      {/* Rota padrão baseada no cargo */}
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
