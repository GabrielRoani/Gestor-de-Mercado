import { useState, useEffect } from "react";
import { Search, Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Filter, MoreHorizontal, Edit, Eye, Trash2, CreditCard, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  supplier: string;
  lastUpdate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Arroz Branco 5kg",
    category: "Grãos",
    stock: 45,
    minStock: 20,
    price: 18.90,
    supplier: "Distribuidor São Paulo",
    lastUpdate: "2024-01-15",
    status: "in_stock"
  },
  {
    id: "2",
    name: "Feijão Preto 1kg",
    category: "Grãos",
    stock: 12,
    minStock: 15,
    price: 8.50,
    supplier: "Cerealista Central",
    lastUpdate: "2024-01-14",
    status: "low_stock"
  },
  {
    id: "3",
    name: "Óleo de Soja 900ml",
    category: "Óleos",
    stock: 0,
    minStock: 10,
    price: 7.20,
    supplier: "Distribuidora Norte",
    lastUpdate: "2024-01-10",
    status: "out_of_stock"
  },
  {
    id: "4",
    name: "Açúcar Cristal 1kg",
    category: "Açúcares",
    stock: 67,
    minStock: 25,
    price: 4.80,
    supplier: "Doce Vida LTDA",
    lastUpdate: "2024-01-15",
    status: "in_stock"
  },
  {
    id: "5",
    name: "Macarrão Espaguete 500g",
    category: "Massas",
    stock: 8,
    minStock: 12,
    price: 3.50,
    supplier: "Pasta & Cia",
    lastUpdate: "2024-01-13",
    status: "low_stock"
  },
];

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const { logout, user, canAccess } = useAuth();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === 'low_stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'out_of_stock').length;
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.price), 0);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const getStatusBadge = (status: Product['status']) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-success text-success-foreground">Em Estoque</Badge>;
      case 'low_stock':
        return <Badge className="bg-warning text-warning-foreground">Estoque Baixo</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Sem Estoque</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Estoque</h1>
            <p className="text-gray-600">Gestão de Mercado - {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            {canAccess('/admin') && (
              <Link to="/admin">
                <Button variant="outline" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Administrativo
                </Button>
              </Link>
            )}
            {canAccess('/pdv') && (
              <Link to="/pdv">
                <Button variant="outline" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  PDV - Caixa
                </Button>
              </Link>
            )}
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
            <Button variant="outline" className="gap-2" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                +2 novos esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produtos precisando reposição
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{outOfStockProducts}</div>
              <p className="text-xs text-muted-foreground">
                Produtos esgotados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalValue.toFixed(2).replace('.', ',')}</div>
              <p className="text-xs text-muted-foreground">
                Valor do estoque atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gerenciar Produtos</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os produtos do estoque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos, categorias ou fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">Todas as Categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Produto</th>
                      <th className="text-left p-4 font-medium">Categoria</th>
                      <th className="text-left p-4 font-medium">Estoque</th>
                      <th className="text-left p-4 font-medium">Preço</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Fornecedor</th>
                      <th className="text-left p-4 font-medium">Última Atualização</th>
                      <th className="text-right p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/25">
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="p-4 text-muted-foreground">{product.category}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              product.stock <= product.minStock && product.stock > 0 && "text-warning",
                              product.stock === 0 && "text-destructive",
                              product.stock > product.minStock && "text-success"
                            )}>
                              {product.stock}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              (min: {product.minStock})
                            </span>
                          </div>
                        </td>
                        <td className="p-4">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                        <td className="p-4">{getStatusBadge(product.status)}</td>
                        <td className="p-4 text-muted-foreground">{product.supplier}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(product.lastUpdate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum produto encontrado</p>
                <p className="text-sm">Tente ajustar os filtros de busca</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesso rápido às funções mais utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <Plus className="h-6 w-6" />
                <span className="text-sm">Novo Produto</span>
              </Button>
              
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Alertas de Estoque</span>
              </Button>
              
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Relatórios</span>
              </Button>
              
              <Button variant="outline" className="h-auto flex-col gap-2 p-6">
                <Package className="h-6 w-6" />
                <span className="text-sm">Entrada de Mercadoria</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
