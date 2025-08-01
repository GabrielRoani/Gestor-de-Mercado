import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export type UserRole = 'admin' | 'estoquista' | 'vendedor';

export interface User {
  id: string;
  name: string;
  login: string; // Alterado de email para login
  role: UserRole;
  active: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (loginCredential: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  canAccess: (route: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

let users: User[] = [
  { id: '1', name: 'João Administrador', login: 'admin', role: 'admin', active: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Maria Estoquista', login: 'estoquista', role: 'estoquista', active: true, createdAt: '2024-01-02' },
  { id: '3', name: 'Carlos Vendedor', login: 'vendedor', role: 'vendedor', active: true, createdAt: '2024-01-03' }
];

export const getAllUsers = (): User[] => users;

type CreateUserData = Omit<User, 'id' | 'createdAt'> & { name: string; role: UserRole; active: boolean; login: string };

export const createUser = (data: CreateUserData): User => {
  const newUser: User = {
    id: String(Date.now()),
    ...data,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (id: string, data: Partial<CreateUserData>): boolean => {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return false;
  users[userIndex] = { ...users[userIndex], ...data };
  return true;
};

export const deleteUser = (id: string): boolean => {
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);
  return users.length < initialLength;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleRoutes: Record<UserRole, string[]> = {
  admin: ['/', '/pdv', '/admin', '/produtos', '/estoque', '/fornecedores', '/relatorios', '/configuracoes', '/usuarios'],
  estoquista: ['/', '/produtos', '/estoque', '/fornecedores'],
  vendedor: ['/pdv']
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
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

        const foundUser = users.find(u => u.login === loginCredential);
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