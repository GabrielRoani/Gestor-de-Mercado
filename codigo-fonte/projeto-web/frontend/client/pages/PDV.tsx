import { useState, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Calculator, CreditCard, Banknote, Receipt, User, Trash2, ScanLine, Package, BarChart3, LogOut } from "lucide-react";
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
  price: number;
  barcode: string;
  category: string;
  unit: string;
}

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

const produtos: Product[] = [
  { id: "1", name: "Arroz Branco 5kg", price: 18.90, barcode: "7891234567890", category: "Grãos", unit: "un" },
  { id: "2", name: "Feijão Preto 1kg", price: 8.50, barcode: "7891234567891", category: "Grãos", unit: "un" },
  { id: "3", name: "Óleo de Soja 900ml", price: 7.20, barcode: "7891234567892", category: "Óleos", unit: "un" },
  { id: "4", name: "Açúcar Cristal 1kg", price: 4.80, barcode: "7891234567893", category: "Açúcares", unit: "un" },
  { id: "5", name: "Macarrão Espaguete 500g", price: 3.50, barcode: "7891234567894", category: "Massas", unit: "un" },
  { id: "6", name: "Leite Integral 1L", price: 4.20, barcode: "7891234567895", category: "Laticínios", unit: "un" },
  { id: "7", name: "Pão de Açúcar 500g", price: 5.90, barcode: "7891234567896", category: "Padaria", unit: "un" },
  { id: "8", name: "Banana", price: 6.50, barcode: "2000000000001", category: "Frutas", unit: "kg" },
  { id: "9", name: "Tomate", price: 8.90, barcode: "2000000000002", category: "Verduras", unit: "kg" },
  { id: "10", name: "Coca-Cola 2L", price: 8.99, barcode: "7891234567897", category: "Bebidas", unit: "un" },
];

export default function PDV() {
  const [searchTerm, setSearchTerm] = useState("");
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<'dinheiro' | 'cartao' | 'pix' | null>(null);
  const [customerMoney, setCustomerMoney] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { logout, user, canAccess } = useAuth();

  const filteredProducts = produtos.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.price }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity, subtotal: quantity * product.price }];
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
          ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
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
      const product = produtos.find(p => p.barcode === barcode);
      if (product) {
        addToCart(product);
        setBarcode("");
      }
    }
  };

  const finalizeSale = () => {
    if (cart.length === 0) return;
    
    // Aqui seria a lógica de finalização da venda
    alert(`Venda finalizada!\nTotal: R$ ${totalValue.toFixed(2).replace('.', ',')}\nPagamento: ${selectedPayment}\n${change > 0 ? `Troco: R$ ${change.toFixed(2).replace('.', ',')}` : ''}`);
    
    // Limpar carrinho após finalização
    setCart([]);
    setSelectedPayment(null);
    setCustomerMoney("");
    setCustomerName("");
  };

  // Produtos de acesso rápido (mais vendidos)
  const quickAccessProducts = produtos.slice(0, 6);

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
                  placeholder="Buscar por nome, categoria..."
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickAccessProducts.map(product => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col gap-2 text-left"
                    onClick={() => addToCart(product)}
                  >
                    <span className="font-medium text-sm">{product.name}</span>
                    <span className="text-primary font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</span>
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
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category} - {product.unit}</p>
                        <p className="text-sm font-bold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</p>
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
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-600">R$ {item.price.toFixed(2).replace('.', ',')} / {item.unit}</p>
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
                      <div className="text-center p-2 bg-success/10 rounded text-success font-medium">
                        Troco: R$ {change.toFixed(2).replace('.', ',')}
                      </div>
                    )}
                    {change < 0 && customerMoney && (
                      <div className="text-center p-2 bg-destructive/10 rounded text-destructive font-medium">
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
