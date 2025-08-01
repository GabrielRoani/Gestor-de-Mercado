import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import apiClient from '@/api/axiosConfig';

export type UserRole = 'admin' | 'estoquista' | 'vendedor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  canAccess: (route: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  { id: '1', name: 'João Administrador', email: 'admin', role: 'admin', active: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Maria Estoquista', email: 'estoquista', role: 'estoquista', active: true, createdAt: '2024-01-02' },
  { id: '3', name: 'Carlos Vendedor', email: 'vendedor', role: 'vendedor', active: true, createdAt: '2024-01-03' }
];

const roleRoutes: Record<UserRole, string[]> = {
  admin: ['/', '/pdv', '/admin', '/produtos', '/estoque', '/fornecedores', '/relatorios', '/configuracoes', '/usuarios'],
  estoquista: ['/', '/produtos', '/estoque', '/fornecedores'],
  vendedor: ['/pdv']
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ===== useEffect CORRIGIDO COM TRATAMENTO DE ERRO =====
  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');
      // Só tenta carregar o usuário se ambos os itens existirem
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      // Se o JSON.parse falhar, limpa os dados corrompidos e segue em frente
      console.error("Falha ao carregar dados do usuário do localStorage:", error);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
  }, []);

  const login = async (loginCredential: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        login: loginCredential,
        senha: password
      });

      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);

        const foundUser = mockUsers.find(u => u.email === loginCredential);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  };

  const canAccess = (route: string): boolean => {
    if (!user) return false;
    const allowedRoutes = roleRoutes[user.role];
    return allowedRoutes.includes(route);
  };

  const hasPermission = () => true;

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    canAccess,
    hasPermission
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}