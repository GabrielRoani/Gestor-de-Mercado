import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Settings,
  FileText,
  Eye,
  Calendar,
  Target,
  Activity,
  User,
  Store,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SalesData {
  period: string;
  sales: number;
  revenue: number;
  transactions: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  soldUnits: number;
  revenue: number;
  margin: number;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'break' | 'offline';
  sales: number;
  transactions: number;
}

const salesData: SalesData[] = [
  { period: "Hoje", sales: 248, revenue: 3456.78, transactions: 89 },
  { period: "Ontem", sales: 312, revenue: 4123.45, transactions: 95 },
  { period: "Esta Semana", sales: 1567, revenue: 21890.32, transactions: 456 },
  { period: "Semana Passada", sales: 1789, revenue: 24567.89, transactions: 523 },
  { period: "Este Mês", sales: 6234, revenue: 87654.21, transactions: 1876 },
  { period: "Mês Passado", sales: 7123, revenue: 98765.43, transactions: 2103 }
];

const topProducts: TopProduct[] = [
  { id: "1", name: "Arroz Branco 5kg", category: "Grãos", soldUnits: 145, revenue: 2740.50, margin: 15.2 },
  { id: "2", name: "Coca-Cola 2L", category: "Bebidas", soldUnits: 89, revenue: 800.11, margin: 22.5 },
  { id: "3", name: "Açúcar Cristal 1kg", category: "Açúcares", soldUnits: 67, revenue: 321.60, margin: 18.0 },
  { id: "4", name: "Feijão Preto 1kg", category: "Grãos", soldUnits: 56, revenue: 476.00, margin: 12.8 },
  { id: "5", name: "Óleo de Soja 900ml", category: "Óleos", soldUnits: 45, revenue: 324.00, margin: 20.1 }
];

const employees: Employee[] = [
  { id: "1", name: "Maria Silva", role: "Caixa", status: "active", sales: 1234.56, transactions: 45 },
  { id: "2", name: "João Santos", role: "Estoquista", status: "active", sales: 0, transactions: 0 },
  { id: "3", name: "Ana Costa", role: "Caixa", status: "break", sales: 987.32, transactions: 32 },
  { id: "4", name: "Pedro Lima", role: "Caixa", status: "offline", sales: 2156.78, transactions: 67 }
];

export default function Admin() {
  const [selectedPeriod, setSelectedPeriod] = useState("Hoje");
  const { logout, user } = useAuth();

  const currentData = salesData.find(data => data.period === selectedPeriod) || salesData[0];
  const previousData = salesData[salesData.indexOf(currentData) + 1] || salesData[1];

  const salesGrowth = ((currentData.sales - previousData.sales) / previousData.sales) * 100;
  const revenueGrowth = ((currentData.revenue - previousData.revenue) / previousData.revenue) * 100;

  // Mock data para estatísticas gerais
  const totalProducts = 1234;
  const lowStockProducts = 23;
  const outOfStockProducts = 5;
  const totalEmployees = 12;
  const activeEmployees = 8;

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Ativo</Badge>;
      case 'break':
        return <Badge className="bg-warning text-warning-foreground">Pausa</Badge>;
      case 'offline':
        return <Badge variant="secondary">Offline</Badge>;
    }
  };

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
            <Link to="/usuarios">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Navegação Rápida */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Acesso Rápido
            </CardTitle>
            <CardDescription>
              Navegue rapidamente para as principais seções do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/pdv">
                <Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Sistema PDV</span>
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full">
                  <Package className="h-6 w-6" />
                  <span className="text-sm">Estoque</span>
                </Button>
              </Link>
              
              <Link to="/relatorios">
                <Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Relatórios</span>
                </Button>
              </Link>
              
              <Link to="/usuarios">
                <Button variant="outline" className="h-auto flex-col gap-2 p-6 w-full">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Usuários</span>
                </Button>
              </Link>
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
              <div className="text-2xl font-bold">{currentData.sales}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {salesGrowth >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                )}
                <span className={salesGrowth >= 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(salesGrowth).toFixed(1)}%
                </span>
                <span className="ml-1">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {currentData.revenue.toFixed(2).replace('.', ',')}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {revenueGrowth >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 text-success mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
                )}
                <span className={revenueGrowth >= 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="ml-1">vs período anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-warning">{lowStockProducts} baixo</span>
                <span className="text-destructive">{outOfStockProducts} esgotados</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEmployees}/{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Funcionários ativos no momento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Seletor de Período */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Análise por Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {salesData.map((data) => (
                <Button
                  key={data.period}
                  variant={selectedPeriod === data.period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(data.period)}
                >
                  {data.period}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Vendas</p>
                <p className="text-2xl font-bold">{currentData.sales}</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold">R$ {currentData.revenue.toFixed(2).replace('.', ',')}</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Transações</p>
                <p className="text-2xl font-bold">{currentData.transactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Produtos Mais Vendidos
              </CardTitle>
              <CardDescription>
                Ranking dos produtos com melhor performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.soldUnits} vendidos</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {product.revenue.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status dos Funcionários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Status dos Funcionários
              </CardTitle>
              <CardDescription>
                Atividade atual da equipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.role}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {getStatusBadge(employee.status)}
                      {employee.role === "Caixa" && (
                        <p className="text-xs text-muted-foreground">
                          {employee.transactions} vendas hoje
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas e Ações Necessárias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas e Ações Necessárias
            </CardTitle>
            <CardDescription>
              Items que requerem atenção imediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-warning/20 bg-warning/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="font-medium text-warning">Estoque Baixo</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {lowStockProducts} produtos precisam de reposição
                </p>
                <Link to="/">
                  <Button size="sm" variant="outline">
                    Ver Produtos
                  </Button>
                </Link>
              </div>

              <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Sem Estoque</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {outOfStockProducts} produtos esgotados
                </p>
                <Link to="/">
                  <Button size="sm" variant="outline">
                    Repor Agora
                  </Button>
                </Link>
              </div>

              <div className="p-4 border border-info/20 bg-info/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-info" />
                  <span className="font-medium text-info">Relatório Pronto</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Relatório mensal disponível para análise
                </p>
                <Link to="/relatorios">
                  <Button size="sm" variant="outline">
                    Ver Relatório
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
