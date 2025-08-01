import { useState, useEffect } from "react";
import apiClient from "@/api/axiosConfig.ts";
import { Search, Package, AlertTriangle, TrendingUp, TrendingDown, Plus, Edit, Trash2, CreditCard, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Interface para o produto, agora com todos os campos
interface Product {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: string;
  fornecedor?: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  precoVenda: number;
  precoCusto: number;
  codigoBarras: string;
  unidadeMedida: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Interface para o formulário de produto (sem id e status)
type ProductFormData = Omit<Product, 'id' | 'status'>;

const initialFormState: ProductFormData = {
  nome: "",
  descricao: "",
  categoria: "",
  fornecedor: "",
  codigoBarras: "",
  precoVenda: 0,
  precoCusto: 0,
  quantidadeEstoque: 0,
  estoqueMinimo: 0,
  unidadeMedida: "UN",
};


export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormState);

  const { logout, user, canAccess } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<Product[]>('/produtos');
      const transformedProducts = response.data.map(p => {
        let status: Product['status'] = 'in_stock';
        if (p.quantidadeEstoque <= 0) status = 'out_of_stock';
        else if (p.quantidadeEstoque <= p.estoqueMinimo) status = 'low_stock';
        return { ...p, status };
      });
      setProducts(transformedProducts);
    } catch (err) {
      setError("Falha ao carregar produtos. Verifique se o backend está rodando.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenForm = (product: Product | null) => {
    setEditingProduct(product);
    setFormData(product ? { ...product } : initialFormState);
    setIsFormOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.nome || formData.precoVenda <= 0) {
      alert("O nome e o preço de venda são obrigatórios.");
      return;
    }
    try {
      if (editingProduct) {
        // Atualiza produto existente
        await apiClient.put(`/produtos/${editingProduct.id}`, formData);
      } else {
        // Cria novo produto
        await apiClient.post('/produtos', formData);
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Não foi possível salvar o produto.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja apagar este produto? Esta ação não pode ser desfeita.")) {
      try {
        await apiClient.delete(`/produtos/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error("Erro ao deletar produto:", error);
        alert("Não foi possível deletar o produto.");
      }
    }
  };


  const filteredProducts = products.filter(product =>
      product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.status === 'low_stock').length;
  const outOfStockProducts = products.filter(p => p.status === 'out_of_stock').length;
  const totalValue = products.reduce((sum, product) => sum + (product.quantidadeEstoque * product.precoVenda), 0);

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

  if (loading) return <div className="p-6 text-center">Carregando produtos...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Estoque</h1>
              <p className="text-gray-600">Gestão de Mercado - {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {canAccess('/admin') && <Link to="/admin"><Button variant="outline" className="gap-2"><BarChart3 className="h-4 w-4" />Administrativo</Button></Link>}
              {canAccess('/pdv') && <Link to="/pdv"><Button variant="outline" className="gap-2"><CreditCard className="h-4 w-4" />PDV - Caixa</Button></Link>}
              <Button className="gap-2" onClick={() => handleOpenForm(null)}><Plus className="h-4 w-4" />Adicionar Produto</Button>
              <Button variant="outline" className="gap-2" onClick={logout}><LogOut className="h-4 w-4" />Sair</Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{totalProducts}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold text-warning">{lowStockProducts}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold text-destructive">{outOfStockProducts}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total em Estoque</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">R$ {totalValue.toFixed(2).replace('.', ',')}</div></CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader><CardTitle>Gerenciar Produtos</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Buscar produtos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="border-b bg-muted/50"><th className="text-left p-4 font-medium">Produto</th><th className="text-left p-4 font-medium">Estoque</th><th className="text-left p-4 font-medium">Preço</th><th className="text-left p-4 font-medium">Status</th><th className="text-right p-4 font-medium">Ações</th></tr>
                    </thead>
                    <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b hover:bg-muted/25">
                          <td className="p-4 font-medium">{product.nome}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                            <span className={cn("font-medium", product.status === 'low_stock' && "text-warning", product.status === 'out_of_stock' && "text-destructive", product.status === 'in_stock' && "text-success")}>
                              {product.quantidadeEstoque}
                            </span>
                              <span className="text-xs text-muted-foreground">(min: {product.estoqueMinimo})</span>
                            </div>
                          </td>
                          <td className="p-4">R$ {product.precoVenda.toFixed(2).replace('.', ',')}</td>
                          <td className="p-4">{getStatusBadge(product.status)}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenForm(product)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
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

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Altere as informações do produto abaixo." : "Preencha as informações do novo item para adicioná-lo ao estoque."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2"><Label htmlFor="nome">Nome do Produto</Label><Input id="nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} /></div>
              <div className="space-y-2"><Label htmlFor="codigoBarras">Código de Barras</Label><Input id="codigoBarras" value={formData.codigoBarras} onChange={(e) => setFormData({...formData, codigoBarras: e.target.value})} /></div>
              <div className="space-y-2"><Label htmlFor="categoria">Categoria</Label><Input id="categoria" value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} /></div>
              <div className="space-y-2"><Label htmlFor="fornecedor">Fornecedor</Label><Input id="fornecedor" value={formData.fornecedor} onChange={(e) => setFormData({...formData, fornecedor: e.target.value})} /></div>
              <div className="space-y-2"><Label htmlFor="precoCusto">Preço de Custo</Label><Input id="precoCusto" type="number" value={formData.precoCusto} onChange={(e) => setFormData({...formData, precoCusto: parseFloat(e.target.value) || 0})} /></div>
              <div className="space-y-2"><Label htmlFor="precoVenda">Preço de Venda</Label><Input id="precoVenda" type="number" value={formData.precoVenda} onChange={(e) => setFormData({...formData, precoVenda: parseFloat(e.target.value) || 0})} /></div>
              <div className="space-y-2"><Label htmlFor="quantidadeEstoque">Qtd. em Estoque</Label><Input id="quantidadeEstoque" type="number" value={formData.quantidadeEstoque} onChange={(e) => setFormData({...formData, quantidadeEstoque: parseInt(e.target.value, 10) || 0})} /></div>
              <div className="space-y-2"><Label htmlFor="estoqueMinimo">Estoque Mínimo</Label><Input id="estoqueMinimo" type="number" value={formData.estoqueMinimo} onChange={(e) => setFormData({...formData, estoqueMinimo: parseInt(e.target.value, 10) || 0})} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveProduct}>Salvar Produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}