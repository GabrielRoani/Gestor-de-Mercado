import React, { createContext, useContext, useState, useEffect } from 'react';

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
  hasPermission: (permission: string) => boolean;
  canAccess: (route: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Administrador',
    email: 'admin@mercado.com',
    role: 'admin',
    active: true,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Maria Estoquista',
    email: 'estoque@mercado.com',
    role: 'estoquista',
    active: true,
    createdAt: '2024-01-02'
  },
  {
    id: '3',
    name: 'Carlos Vendedor',
    email: 'vendas@mercado.com',
    role: 'vendedor',
    active: true,
    createdAt: '2024-01-03'
  }
];

// Mapeamento de permissões por cargo
const rolePermissions: Record<UserRole, string[]> = {
  admin: ['*'], // Acesso total
  estoquista: ['estoque', 'produtos', 'fornecedores'],
  vendedor: ['pdv', 'vendas']
};

// Mapeamento de rotas permitidas por cargo
const roleRoutes: Record<UserRole, string[]> = {
  admin: ['/', '/pdv', '/admin', '/produtos', '/estoque', '/fornecedores', '/relatorios', '/configuracoes', '/usuarios'],
  estoquista: ['/', '/produtos', '/estoque', '/fornecedores'],
  vendedor: ['/pdv']
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Tentar recuperar usuário do localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simular validação de login
    const foundUser = mockUsers.find(u => u.email === email && u.active);
    
    if (foundUser && password === '123456') { // Senha fixa para demo
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = rolePermissions[user.role];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const canAccess = (route: string): boolean => {
    if (!user) return false;
    
    const allowedRoutes = roleRoutes[user.role];
    return allowedRoutes.includes(route);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    canAccess
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

// Hook para verificar se usuário tem permissão específica
export function usePermission(permission: string) {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

// Hook para verificar se usuário pode acessar rota específica
export function useCanAccess(route: string) {
  const { canAccess } = useAuth();
  return canAccess(route);
}

// Função auxiliar para obter todos os usuários (para admin)
export function getAllUsers(): User[] {
  return mockUsers;
}

// Função auxiliar para criar novo usuário (para admin)
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  mockUsers.push(newUser);
  return newUser;
}

// Função auxiliar para atualizar usuário (para admin)
export function updateUser(userId: string, updates: Partial<User>): boolean {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return true;
  }
  return false;
}

// Função auxiliar para excluir usuário (para admin)
export function deleteUser(userId: string): boolean {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1);
    return true;
  }
  return false;
}
