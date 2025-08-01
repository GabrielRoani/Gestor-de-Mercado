import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldX, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoute?: string;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredRoute, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, canAccess, hasPermission, user } = useAuth();

  // Se não estiver autenticado, não renderiza nada (será redirecionado para login)
  if (!isAuthenticated) {
    return null;
  }

  // Verificar permissão de rota
  if (requiredRoute && !canAccess(requiredRoute)) {
    return <AccessDenied userRole={user?.role} requiredAccess="esta página" />;
  }

  // Verificar permissão específica
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied userRole={user?.role} requiredAccess={requiredPermission} />;
  }

  return <>{children}</>;
}

interface AccessDeniedProps {
  userRole?: string;
  requiredAccess: string;
}

function AccessDenied({ userRole, requiredAccess }: AccessDeniedProps) {
  const getHomeRoute = () => {
    switch (userRole) {
      case 'admin':
        return '/admin';
      case 'estoquista':
        return '/';
      case 'vendedor':
        return '/pdv';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-destructive">Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar {requiredAccess}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Seu cargo atual ({userRole}) não permite o acesso a esta funcionalidade.
            Entre em contato com o administrador se precisar de acesso.
          </p>
          
          <div className="space-y-2">
            <Link to={getHomeRoute()}>
              <Button className="w-full gap-2">
                <Home className="h-4 w-4" />
                Voltar à Página Inicial
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProtectedRoute;
