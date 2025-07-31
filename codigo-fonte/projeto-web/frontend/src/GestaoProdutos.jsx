import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GestaoProdutos.css'; // Vamos usar este ficheiro para o estilo

// URL da sua API backend. Altere se for diferente.
const API_URL = 'http://localhost:8080/api';

function GestaoProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState({
        nome: '',
        precoVenda: '',
        quantidadeEstoque: '',
    });
    const [produtoEditando, setProdutoEditando] = useState(null); // State para controlar o produto em edição
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State para controlar a visibilidade do modal

    // Função para carregar os produtos da API
    const carregarProdutos = () => {
        axios.get(`${API_URL}/produtos`)
            .then(response => {
                setProdutos(response.data);
            })
            .catch(error => console.error("Erro ao carregar produtos:", error));
    };

    // useEffect para carregar os produtos quando o componente é montado
    useEffect(() => {
        carregarProdutos();
    }, []);

    // Função para lidar com mudanças nos inputs do formulário de adição
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Função para lidar com mudanças nos inputs do formulário de edição
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setProdutoEditando({ ...produtoEditando, [name]: value });
    };

    // Função para submeter o formulário e criar um novo produto
    const handleAddSubmit = (e) => {
        e.preventDefault();
        const novoProduto = {
            ...form,
            precoVenda: parseFloat(form.precoVenda.replace(',', '.')),
            quantidadeEstoque: parseInt(form.quantidadeEstoque, 10),
            // Valores padrão para os outros campos, conforme o backend
            precoCusto: "0.00",
            codigoBarras: Date.now().toString(),
            estoqueMinimo: 0,
            unidadeMedida: "UN"
        };

        axios.post(`${API_URL}/produtos`, novoProduto)
            .then(() => {
                alert('Produto criado com sucesso!');
                setForm({ nome: '', precoVenda: '', quantidadeEstoque: '' }); // Limpa o formulário
                carregarProdutos(); // Recarrega a lista
            })
            .catch(error => console.error("Erro ao criar produto:", error));
    };

    // Função para submeter o formulário de edição
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const produtoAtualizado = {
            ...produtoEditando,
            precoVenda: parseFloat(produtoEditando.precoVenda.toString().replace(',', '.')),
            quantidadeEstoque: parseInt(produtoEditando.quantidadeEstoque, 10),
        };

        axios.put(`${API_URL}/produtos/${produtoEditando.id}`, produtoAtualizado)
            .then(() => {
                alert('Produto atualizado com sucesso!');
                setIsEditModalOpen(false); // Fecha o modal
                setProdutoEditando(null); // Limpa o estado de edição
                carregarProdutos(); // Recarrega a lista
            })
            .catch(error => console.error("Erro ao atualizar produto:", error));
    };

    // Função para deletar um produto
    const handleDelete = (id) => {
        if (window.confirm('Tem a certeza que deseja excluir este produto?')) {
            axios.delete(`${API_URL}/produtos/${id}`)
                .then(() => {
                    alert('Produto excluído com sucesso!');
                    carregarProdutos(); // Recarrega a lista
                })
                .catch(error => console.error("Erro ao excluir produto:", error));
        }
    };

    // Funções para controlar o modal de edição
    const openEditModal = (produto) => {
        setProdutoEditando(produto);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setProdutoEditando(null);
    };


    return (
        <div className="container">
            <h1>Gestão de Produtos Conectta</h1>

            {/* Formulário de Adição */}
            <div className="form-container">
                <h2>Adicionar Novo Produto</h2>
                <form onSubmit={handleAddSubmit}>
                    <input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Nome do Produto"
                        required
                    />
                    <input
                        type="text"
                        name="precoVenda"
                        value={form.precoVenda}
                        onChange={handleChange}
                        placeholder="Preço de Venda (ex: 10.50)"
                        required
                    />
                    <input
                        type="number"
                        name="quantidadeEstoque"
                        value={form.quantidadeEstoque}
                        onChange={handleChange}
                        placeholder="Quantidade Inicial"
                        required
                    />
                    <button type="submit">Adicionar Produto</button>
                </form>
            </div>

            {/* Lista de Produtos */}
            <div className="list-container">
                <h2>Lista de Produtos</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Stock</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {produtos.map(produto => (
                        <tr key={produto.id}>
                            <td>{produto.id}</td>
                            <td>{produto.nome}</td>
                            <td>R$ {parseFloat(produto.precoVenda).toFixed(2)}</td>
                            <td>{produto.quantidadeEstoque}</td>
                            <td>
                                <button className="edit-btn" onClick={() => openEditModal(produto)}>Editar</button>
                                <button className="delete-btn" onClick={() => handleDelete(produto.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Edição */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar Produto</h2>
                        <form onSubmit={handleEditSubmit}>
                            <input
                                type="text"
                                name="nome"
                                value={produtoEditando.nome}
                                onChange={handleEditChange}
                                placeholder="Nome do Produto"
                                required
                            />
                            <input
                                type="text"
                                name="precoVenda"
                                value={produtoEditando.precoVenda}
                                onChange={handleEditChange}
                                placeholder="Preço de Venda"
                                required
                            />
                            <input
                                type="number"
                                name="quantidadeEstoque"
                                value={produtoEditando.quantidadeEstoque}
                                onChange={handleEditChange}
                                placeholder="Quantidade em Estoque"
                                required
                            />
                            <div className="modal-actions">
                                <button type="submit">Salvar Alterações</button>
                                <button type="button" onClick={closeEditModal}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GestaoProdutos;