import { useState, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Calculator, CreditCard, Banknote, Receipt, User, Trash2, ScanLine, Package, BarChart3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/api/axiosConfig"; // Importe o apiClient

// Interfaces ajustadas para corresponder à API
interface Product {
  id: string;
  nome: string;
  precoVenda: number;
  codigoBarras: string;
  unidadeMedida: string;
  // Adicione outros campos se necessário, ex: category
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

export default function PDV() {
  const [searchTerm, setSearchTerm] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<'dinheiro' | 'cartao' | 'pix' | null>(null);
  const [customerMoney, setCustomerMoney] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { logout, user, canAccess } = useAuth();

  // Estado para armazenar os produtos vindos da API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get<Product[]>('/produtos');
        setProducts(response.data);
      } catch (err) {
        setError("Falha ao carregar produtos da API.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const filteredProducts = products.filter(product =>
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigoBarras.includes(searchTerm)
  );

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.precoVenda }
                : item
        );
      } else {
        return [...prevCart, { ...product, quantity, subtotal: quantity * product.precoVenda }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
        prevCart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.precoVenda }
                : item
        )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const change = customerMoney ? parseFloat(customerMoney) - totalValue : 0;

  const handleBarcodeSearch = () => {
    if (barcode) {
      const product = products.find(p => p.codigoBarras === barcode);
      if (product) {
        addToCart(product);
        setBarcode("");
      }
    }
  };

  const finalizeSale = () => {
    if (cart.length === 0) return;

    alert(`Venda finalizada!\nTotal: R$ ${totalValue.toFixed(2).replace('.', ',')}\nPagamento: ${selectedPayment}\n${change > 0 ? `Troco: R$ ${change.toFixed(2).replace('.', ',')}` : ''}`);

    setCart([]);
    setSelectedPayment(null);
    setCustomerMoney("");
    setCustomerName("");
  };

  // Produtos de acesso rápido (mais vendidos) - agora pegando da API
  const quickAccessProducts = products.slice(0, 6);

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PDV - Ponto de Venda</h1>
              <p className="text-gray-600">Sistema de Caixa - {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              {canAccess('/admin') && (
                  <Link to="/admin">
                    <Button variant="outline" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Admin
                    </Button>
                  </Link>
              )}
              {canAccess('/') && (
                  <Link to="/">
                    <Button variant="outline" className="gap-2">
                      <Package className="h-4 w-4" />
                      Estoque
                    </Button>
                  </Link>
              )}
              <Button variant="outline" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-600">Cliente: {customerName || "Não informado"}</p>
                <p className="text-xs text-gray-500">{new Date().toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-100px)]">
          {/* Lado Esquerdo - Busca e Produtos */}
          <div className="flex-1 p-6 lg:border-r lg:overflow-y-auto">
            {/* Busca de Produtos */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Buscar Produtos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Busca por Nome */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                      placeholder="Buscar por nome, código..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                  />
                </div>

                {/* Código de Barras */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ScanLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Código de barras"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                        className="pl-10"
                    />
                  </div>
                  <Button onClick={handleBarcodeSearch} disabled={!barcode}>
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Produtos de Acesso Rápido */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Acesso Rápido</CardTitle>
                <CardDescription>Produtos mais vendidos</CardDescription>
              </CardHeader>
              <CardContent>
                {loading && <p>Carregando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickAccessProducts.map(product => (
                      <Button
                          key={product.id}
                          variant="outline"
                          className="h-auto p-4 flex flex-col gap-2 text-left"
                          onClick={() => addToCart(product)}
                      >
                        <span className="font-medium text-sm">{product.nome}</span>
                        <span className="text-primary font-bold">R$ {product.precoVenda.toFixed(2).replace('.', ',')}</span>
                      </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lista de Produtos Filtrados */}
            {searchTerm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resultados da Busca</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredProducts.map(product => (
                          <div
                              key={product.id}
                              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium">{product.nome}</h4>
                              <p className="text-sm text-gray-600">{product.unidadeMedida}</p>
                              <p className="text-sm font-bold text-primary">R$ {product.precoVenda.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <Button onClick={() => addToCart(product)} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            )}
          </div>

          {/* Lado Direito - Carrinho e Pagamento */}
          <div className="lg:w-96 bg-white p-6 flex flex-col border-t lg:border-t-0 lg:border-l min-h-[60vh] lg:min-h-0">
            {/* Informações do Cliente */}
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Cliente</span>
                </div>
                <Input
                    placeholder="Nome do cliente (opcional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Carrinho */}
            <Card className="flex-1 mb-4">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                  </CardTitle>
                  {cart.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearCart}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">Carrinho vazio</p>
                  ) : (
                      cart.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.nome}</p>
                              <p className="text-xs text-gray-600">R$ {item.precoVenda.toFixed(2).replace('.', ',')} / {item.unidadeMedida}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                              <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500"
                                  onClick={() => removeFromCart(item.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Total */}
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métodos de Pagamento */}
            {cart.length > 0 && (
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Forma de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                          variant={selectedPayment === 'dinheiro' ? 'default' : 'outline'}
                          className="flex-col gap-1 h-auto py-3"
                          onClick={() => setSelectedPayment('dinheiro')}
                      >
                        <Banknote className="h-4 w-4" />
                        <span className="text-xs">Dinheiro</span>
                      </Button>
                      <Button
                          variant={selectedPayment === 'cartao' ? 'default' : 'outline'}
                          className="flex-col gap-1 h-auto py-3"
                          onClick={() => setSelectedPayment('cartao')}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span className="text-xs">Cartão</span>
                      </Button>
                      <Button
                          variant={selectedPayment === 'pix' ? 'default' : 'outline'}
                          className="flex-col gap-1 h-auto py-3"
                          onClick={() => setSelectedPayment('pix')}
                      >
                        <Calculator className="h-4 w-4" />
                        <span className="text-xs">PIX</span>
                      </Button>
                    </div>

                    {selectedPayment === 'dinheiro' && (
                        <div className="space-y-2">
                          <Input
                              placeholder="Valor recebido"
                              type="number"
                              step="0.01"
                              value={customerMoney}
                              onChange={(e) => setCustomerMoney(e.target.value)}
                          />
                          {change > 0 && (
                              <div className="text-center p-2 bg-green-100 rounded text-green-700 font-medium">
                                Troco: R$ {change.toFixed(2).replace('.', ',')}
                              </div>
                          )}
                          {change < 0 && customerMoney && (
                              <div className="text-center p-2 bg-red-100 rounded text-red-700 font-medium">
                                Valor insuficiente
                              </div>
                          )}
                        </div>
                    )}
                  </CardContent>
                </Card>
            )}

            {/* Finalizar Venda */}
            {cart.length > 0 && (
                <Button
                    className="w-full gap-2 h-12"
                    onClick={finalizeSale}
                    disabled={!selectedPayment || (selectedPayment === 'dinheiro' && change < 0)}
                >
                  <Receipt className="h-4 w-4" />
                  Finalizar Venda
                </Button>
            )}
          </div>
        </div>
      </div>
  );
}