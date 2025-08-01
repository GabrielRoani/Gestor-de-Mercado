import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  FileText,
  Target,
  User,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  XCircle,
  CreditCard
} from "lucide-react";
import { useAuth, type User as AuthUser } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/api/axiosConfig";

// Interfaces para os dados da API
interface DashboardStats {
  totalProdutos: number;
  produtosEstoqueBaixo: number;
  produtosForaDeEstoque: number;
  totalUsuarios: number;
  usuariosAtivos: number;
}

interface VendaStats {
  vendas: number;
  faturamento: number;
  transacoes: number;
}

interface TopProduct {
  id: string;
  nome: string;
  categoria: string;
  unidadesVendidas: number;
  receita: number;
}

interface Employee extends AuthUser {
  status: 'active' | 'offline';
}

export default function Admin() {
  const { logout, user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salesToday, setSalesToday] = useState<VendaStats | null>(null);
  const [salesYesterday, setSalesYesterday] = useState<VendaStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const salesGrowth = salesToday && salesYesterday && salesYesterday.vendas > 0
      ? ((salesToday.vendas - salesYesterday.vendas) / salesYesterday.vendas) * 100
      : 0;

  const revenueGrowth = salesToday && salesYesterday && salesYesterday.faturamento > 0
      ? ((salesToday.faturamento - salesYesterday.faturamento) / salesYesterday.faturamento) * 100
      : 0;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsResponse, usersResponse, salesResponse, topProductsResponse] = await Promise.all([
          apiClient.get<DashboardStats>('/dashboard/stats'),
          apiClient.get<AuthUser[]>('/usuarios'),
          apiClient.get<{ hoje: VendaStats, ontem: VendaStats }>('/dashboard/vendas-stats'),
          apiClient.get<TopProduct[]>('/dashboard/top-produtos')
        ]);

        setStats(statsResponse.data);
        setSalesToday(salesResponse.data.hoje);
        setSalesYesterday(salesResponse.data.ontem);
        setTopProducts(topProductsResponse.data);

        const employeeData = usersResponse.data.map(u => ({
          ...u,
          status: Math.random() > 0.3 ? 'active' : 'offline'
        })) as Employee[];
        setEmployees(employeeData);

      } catch (error) {
        console.error("Falha ao buscar dados do painel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: Employee['status']) => {
    return status === 'active'
        ? <Badge className="bg-success text-success-foreground">Ativo</Badge>
        : <Badge variant="secondary">Offline</Badge>;
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando dados do painel...</div>;
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Visão Geral do Sistema de Gestão</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">{user?.name} - {user?.role}</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleString('pt-BR')}</p>
              </div>
              <Link to="/usuarios"><Button variant="outline" className="gap-2"><Users className="h-4 w-4" />Usuários</Button></Link>
              <Button variant="outline" className="gap-2" onClick={logout}><LogOut className="h-4 w-4" />Sair</Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Acesso Rápido */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Acesso Rápido</CardTitle>
              <CardDescription>Navegue rapidamente para as principais seções</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/pdv"><Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full"><CreditCard className="h-6 w-6" /><span>Sistema PDV</span></Button></Link>
                <Link to="/"><Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full"><Package className="h-6 w-6" /><span>Estoque</span></Button></Link>
                <Link to="/relatorios"><Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full"><FileText className="h-6 w-6" /><span>Relatórios</span></Button></Link>
                <Link to="/usuarios"><Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full"><Users className="h-6 w-6" /><span>Usuários</span></Button></Link>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesToday?.vendas ?? 0}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className={`h-3 w-3 mr-1 ${salesGrowth >= 0 ? 'text-success' : 'text-destructive'}`} />
                  <span className={salesGrowth >= 0 ? "text-success" : "text-destructive"}>{Math.abs(salesGrowth).toFixed(1)}%</span>
                  <span className="ml-1">vs ontem</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faturamento Hoje</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {(salesToday?.faturamento ?? 0).toFixed(2).replace('.', ',')}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ArrowUpRight className={`h-3 w-3 mr-1 ${revenueGrowth >= 0 ? 'text-success' : 'text-destructive'}`} />
                  <span className={revenueGrowth >= 0 ? "text-success" : "text-destructive"}>{Math.abs(revenueGrowth).toFixed(1)}%</span>
                  <span className="ml-1">vs ontem</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProdutos ?? '...'}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="text-warning">{stats?.produtosEstoqueBaixo ?? '...'} baixo</span>
                  <span className="text-destructive">{stats?.produtosForaDeEstoque ?? '...'} esgotados</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.usuariosAtivos ?? '...'}/{stats?.totalUsuarios ?? '...'}</div>
                <p className="text-xs text-muted-foreground">Funcionários ativos</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Produtos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Produtos Mais Vendidos</CardTitle>
                <CardDescription>Ranking dos produtos com melhor performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-sm font-bold">#{index + 1}</span></div>
                          <div>
                            <p className="font-medium">{product.nome}</p>
                            <p className="text-sm text-muted-foreground">{product.categoria}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{product.unidadesVendidas} vendidos</p>
                          <p className="text-sm text-muted-foreground">R$ {product.receita.toFixed(2).replace('.', ',')}</p>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status dos Funcionários */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Status dos Funcionários</CardTitle>
                <CardDescription>Atividade atual da equipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><User className="h-5 w-5" /></div>
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-sm text-muted-foreground">{employee.role}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">{getStatusBadge(employee.status)}</div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}