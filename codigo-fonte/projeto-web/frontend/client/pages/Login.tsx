import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, User, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const [loginField, setLoginField] = useState(""); // Alterado de email para loginField
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(loginField, password); // Alterado de email para loginField
      if (!success) {
        setError("Usuário ou senha incorretos");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Usuários de demonstração atualizados para usar 'login'
  const demoUsers = [
    { login: "admin", role: "Administrador", color: "bg-blue-500" },
    { login: "estoquista", role: "Estoquista", color: "bg-green-500" },
    { login: "vendedor", role: "Vendedor", color: "bg-orange-500" }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo e Título */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Store className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sistema de Gestão</h1>
              <p className="text-muted-foreground">Mercado & Varejo</p>
            </div>
          </div>

          {/* Formulário de Login */}
          <Card>
            <CardHeader>
              <CardTitle>Fazer Login</CardTitle>
              <CardDescription>
                Digite suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Usuário */}
                <div className="space-y-2">
                  <label htmlFor="login" className="text-sm font-medium">
                    Usuário
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="login"
                        type="text" // Alterado de email para text
                        placeholder="Digite seu usuário"
                        value={loginField}
                        onChange={(e) => setLoginField(e.target.value)}
                        className="pl-10"
                        required
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Erro */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">{error}</span>
                    </div>
                )}

                {/* Botão de Login */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usuários de Demonstração</CardTitle>
              <CardDescription>
                A senha para todos os usuários é <strong>senha123</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoUsers.map((user, index) => (
                  <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setLoginField(user.login);
                        setPassword("senha123");
                      }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", user.color)} />
                      <div>
                        <p className="font-medium text-sm">{user.login}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Clique para preencher
                    </Badge>
                  </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}