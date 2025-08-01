import { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig.ts";
import { Search, Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Filter, Edit, Eye, Trash2, CreditCard, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 2. Interface ajustada para corresponder ao backend
interface Product {
  id: string;
  nome: string;
  // category: string; // Campo não disponível na API no momento
  quantidadeEstoque: number;
  estoqueMinimo: number;
  precoVenda: number;
  // Os campos abaixo não vêm da API, mas 'status' será calculado
  // supplier: string;
  // lastUpdate: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Interface para os dados que vêm da API
interface ProductFromAPI {
  id: string;
  codigoBarras: string;
  nome: string;
  precoVenda: number;
  precoCusto: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  unidadeMedida: string;
}

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // 3. Estados para armazenar produtos, status de carregamento e erros
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout, user, canAccess } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use a nova instância. Não precisa da URL completa.
        const response = await apiClient.get<ProductFromAPI[]>('/produtos');

        // O resto da função permanece igual...
        const transformedProducts = response.data.map(p => {
          // ...lógica de transformação
          let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
          if (p.quantidadeEstoque <= 0) {
            status = 'out_of_stock';
          } else if (p.quantidadeEstoque <= p.estoqueMinimo) {
            status = 'low_stock';
          }
          return {
            id: p.id,
            nome: p.nome,
            quantidadeEstoque: p.quantidadeEstoque,
            estoqueMinimo: p.estoqueMinimo,
            precoVenda: p.precoVenda,
            status: status,
          };
        });

        setProducts(transformedProducts);
      } catch (err) {
        setError("Falha ao carregar produtos. Verifique se o backend está rodando e se você está logado.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 6. Lógica de filtro ajustada para os novos nomes de campos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    // A busca por categoria e fornecedor foi removida por enquanto
    const matchesCategory = selectedCategory === "all"; // Ou adicione a lógica de categoria se o campo existir
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === 'low_stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'out_of_stock').length;
  const totalValue = products.reduce((sum, product) => sum + (product.quantidadeEstoque * product.precoVenda), 0);

  // const categories = Array.from(new Set(products.map(p => p.category)));

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

  // 7. Exibir mensagens de carregamento ou erro
  if (loading) {
    return <div className="p-6">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
      // O JSX restante permanece quase o mesmo, apenas ajustando os nomes dos campos
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">{lowStockProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{outOfStockProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalValue.toFixed(2).replace('.', ',')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Gerenciar Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                      placeholder="Buscar produtos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                  />
                </div>
              </div>

              {/* Products Table */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Produto</th>
                      <th className="text-left p-4 font-medium">Estoque</th>
                      <th className="text-left p-4 font-medium">Preço</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-muted/25">
                          <td className="p-4 font-medium">{product.nome}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                            <span className={cn(
                                "font-medium",
                                product.quantidadeEstoque <= product.estoqueMinimo && product.quantidadeEstoque > 0 && "text-warning",
                                product.quantidadeEstoque === 0 && "text-destructive",
                                product.quantidadeEstoque > product.estoqueMinimo && "text-success"
                            )}>
                              {product.quantidadeEstoque}
                            </span>
                              <span className="text-xs text-muted-foreground">
                              (min: {product.estoqueMinimo})
                            </span>
                            </div>
                          </td>
                          <td className="p-4">R$ {product.precoVenda.toFixed(2).replace('.', ',')}</td>
                          <td className="p-4">{getStatusBadge(product.status)}</td>
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
            </CardContent>
          </Card>
        </div>
      </div>
  );
}