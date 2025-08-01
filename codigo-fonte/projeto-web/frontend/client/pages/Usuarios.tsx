import { useState, useEffect } from "react";
import { useAuth, type User, type UserRole } from "@/contexts/AuthContext";
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
import apiClient from "@/api/axiosConfig"; // Importe o apiClient

interface UserFormData {
  name: string;
  login: string;
  role: UserRole;
  active: boolean;
  senha?: string; // Senha é opcional na atualização
}

// Interface para o usuário que vem da API (sem o campo 'active' e 'name')
interface UserFromAPI {
  id: string;
  login: string;
  cargo: UserRole;
}


export default function Usuarios() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    login: '',
    role: 'vendedor',
    active: true,
    senha: ''
  });

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get<UserFromAPI[]>('/usuarios');
      // Adaptando os dados da API para o formato do frontend
      const adaptedUsers = response.data.map(u => ({
        id: u.id,
        name: u.login, // Usando login como nome temporariamente
        login: u.login,
        role: u.cargo,
        active: true, // Mockado como true por enquanto
        createdAt: new Date().toISOString() // Mockado
      }));
      setUsers(adaptedUsers);
    } catch (error) {
      console.error("Falha ao buscar usuários:", error);
      alert("Não foi possível carregar os usuários da API.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    // Preparar dados para enviar para a API
    const payload = {
      login: formData.login,
      cargo: formData.role,
      // Envia a senha apenas se não for uma edição ou se uma nova senha foi digitada
      ...(formData.senha && { senha: formData.senha })
    };

    try {
      if (editingUser) {
        // Atualizar usuário existente
        await apiClient.put(`/usuarios/${editingUser.id}`, payload);
      } else {
        // Criar novo usuário
        await apiClient.post('/usuarios', payload);
      }
      fetchUsers(); // Recarrega a lista
      resetForm();
    } catch (error) {
      console.error("Falha ao salvar usuário:", error);
      alert("Ocorreu um erro ao salvar o usuário.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (userId === currentUser?.id) {
      alert("Você não pode excluir seu próprio usuário!");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await apiClient.delete(`/usuarios/${userId}`);
        fetchUsers(); // Recarrega a lista
      } catch (error) {
        console.error("Falha ao deletar usuário:", error);
        alert("Ocorreu um erro ao deletar o usuário.");
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      login: user.login,
      role: user.role,
      active: user.active,
      senha: '' // Limpa o campo de senha ao editar
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      login: '',
      role: 'vendedor',
      active: true,
      senha: ''
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-blue-500 text-white">Administrador</Badge>;
      case 'estoquista':
        return <Badge className="bg-green-500 text-white">Estoquista</Badge>;
      case 'vendedor':
        return <Badge className="bg-orange-500 text-white">Vendedor</Badge>;
    }
  };

  const getStatusBadge = (active: boolean) => {
    return active ? (
        <Badge className="bg-green-500 text-white">Ativo</Badge>
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
                  <CardTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle>
                  <CardDescription>
                    {editingUser ? 'Atualize as informações do usuário' : 'Preencha os dados do novo funcionário'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Login do Usuário</label>
                      <Input
                          value={formData.login}
                          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                          placeholder="Login do funcionário"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Senha</label>
                      <Input
                          type="password"
                          value={formData.senha}
                          onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                          placeholder={editingUser ? "Deixe em branco para não alterar" : "Senha de acesso"}
                      />
                    </div>


                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cargo</label>
                      <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="VENDEDOR">Vendedor</option>
                        <option value="ESTOQUISTA">Estoquista</option>
                        <option value="ADMINISTRADOR">Administrador</option>
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
                      <th className="text-left p-4 font-medium">Cargo</th>
                      <th className="text-left p-4 font-medium">Status</th>
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
                          <td className="p-4">{getRoleBadge(user.role)}</td>
                          <td className="p-4">{getStatusBadge(user.active)}</td>
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