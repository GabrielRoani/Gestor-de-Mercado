import { useState } from "react";
import { useAuth, getAllUsers, createUser, updateUser, deleteUser, type User, type UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  User as UserIcon, 
  Mail, 
  Shield,
  Check,
  X,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export default function Usuarios() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'vendedor',
    active: true
  });

  const handleSave = () => {
    if (editingUser) {
      // Atualizar usuário existente
      const success = updateUser(editingUser.id, formData);
      if (success) {
        setUsers(getAllUsers());
        resetForm();
      }
    } else {
      // Criar novo usuário
      const newUser = createUser(formData);
      setUsers(getAllUsers());
      resetForm();
    }
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser?.id) {
      alert("Você não pode excluir seu próprio usuário!");
      return;
    }
    
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      const success = deleteUser(userId);
      if (success) {
        setUsers(getAllUsers());
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'vendedor',
      active: true
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-500 text-white">Administrador</Badge>;
      case 'estoquista':
        return <Badge className="bg-success text-success-foreground">Estoquista</Badge>;
      case 'vendedor':
        return <Badge className="bg-orange-500 text-white">Vendedor</Badge>;
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge className="bg-success text-success-foreground">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h1>
            <p className="text-gray-600">Administração de funcionários e permissões</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Admin
              </Button>
            </Link>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estoquistas</CardTitle>
              <UserIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'estoquista').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
              <UserIcon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'vendedor').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Formulário de Usuário */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingUser ? 'Editar Usuário' : 'Novo Usu��rio'}</CardTitle>
              <CardDescription>
                {editingUser ? 'Atualize as informações do usuário' : 'Preencha os dados do novo funcionário'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do funcionário"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cargo</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="vendedor">Vendedor</option>
                    <option value="estoquista">Estoquista</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Check className="h-4 w-4 mr-2" />
                  {editingUser ? 'Atualizar' : 'Criar'} Usuário
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários do Sistema</CardTitle>
            <CardDescription>
              Gerencie todos os funcionários e suas permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">Usuário</th>
                      <th className="text-left p-4 font-medium">Email</th>
                      <th className="text-left p-4 font-medium">Cargo</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Criado em</th>
                      <th className="text-right p-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-muted/25">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <UserIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              {user.id === currentUser?.id && (
                                <p className="text-xs text-muted-foreground">(Você)</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4">{getRoleBadge(user.role)}</td>
                        <td className="p-4">{getStatusBadge(user.active)}</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.id !== currentUser?.id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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
