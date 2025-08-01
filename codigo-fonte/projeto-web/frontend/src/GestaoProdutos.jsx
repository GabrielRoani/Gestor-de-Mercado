import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GestaoProdutos.css';

// URL base da nossa API que está rodando no back-end
const API_URL = 'http://localhost:8080/api';

function GestaoProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState({
        id: null,
        nome: '',
        precoVenda: '',
        quantidadeEstoque: '',
        codigoBarras: '',
        precoCusto: '',
        estoqueMinimo: '',
        unidadeMedida: 'UN'
    });
    // NOVO ESTADO: para saber se estamos editando ou criando um produto
    const [isEditing, setIsEditing] = useState(false);

    // Função para carregar os produtos da API (READ)
    const carregarProdutos = () => {
        axios.get(`${API_URL}/produtos`)
            .then(response => {
                setProdutos(response.data);
            })
            .catch(error => console.error("Erro ao carregar produtos:", error));
    };

    // useEffect para carregar os produtos na primeira vez que o componente renderiza
    useEffect(() => {
        carregarProdutos();
    }, []);

    // Função para lidar com mudanças nos inputs do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Função para limpar o formulário e voltar ao modo de criação
    const resetForm = () => {
        setForm({
            id: null,
            nome: '',
            precoVenda: '',
            quantidadeEstoque: '',
            codigoBarras: '',
            precoCusto: '',
            estoqueMinimo: '',
            unidadeMedida: 'UN'
        });
        setIsEditing(false);
    };

    // Função para submeter o formulário (CREATE ou UPDATE)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepara o objeto produto com os dados do formulário
        const produtoData = {
            ...form,
            // Garante que os valores numéricos sejam enviados corretamente
            precoVenda: parseFloat(String(form.precoVenda).replace(',', '.')) || 0,
            precoCusto: parseFloat(String(form.precoCusto).replace(',', '.')) || 0,
            quantidadeEstoque: parseInt(form.quantidadeEstoque, 10) || 0,
            estoqueMinimo: parseInt(form.estoqueMinimo, 10) || 0,
            codigoBarras: form.codigoBarras || Date.now().toString(), // Gera um código se não houver
        };

        // Se estiver editando, faz uma requisição PUT (UPDATE)
        if (isEditing) {
            axios.put(`${API_URL}/produtos/${form.id}`, produtoData)
                .then(() => {
                    alert('Produto atualizado com sucesso!');
                    resetForm();
                    carregarProdutos();
                })
                .catch(error => console.error("Erro ao atualizar produto:", error));
        } else {
            // Se não, faz uma requisição POST (CREATE)
            axios.post(`${API_URL}/produtos`, produtoData)
                .then(() => {
                    alert('Produto criado com sucesso!');
                    resetForm();
                    carregarProdutos();
                })
                .catch(error => console.error("Erro ao criar produto:", error));
        }
    };

    // NOVO: Função para preparar o formulário para edição (UPDATE)
    const handleEdit = (produto) => {
        setForm(produto);
        setIsEditing(true);
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    };

    // NOVO: Função para deletar um produto (DELETE)
    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            axios.delete(`${API_URL}/produtos/${id}`)
                .then(() => {
                    alert('Produto deletado com sucesso!');
                    carregarProdutos(); // Recarrega a lista
                })
                .catch(error => console.error("Erro ao deletar produto:", error));
        }
    };

    return (
        <div className="container">
            <h1>Gestão de Produtos Conectta</h1>

            <div className="form-container">
                <h2>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome do Produto" required />
                    <input type="text" name="precoVenda" value={form.precoVenda} onChange={handleChange} placeholder="Preço de Venda (ex: 10.50)" required />
                    <input type="number" name="quantidadeEstoque" value={form.quantidadeEstoque} onChange={handleChange} placeholder="Quantidade em Estoque" required />
                    <input type="text" name="precoCusto" value={form.precoCusto} onChange={handleChange} placeholder="Preço de Custo (ex: 5.25)" />
                    <input type="number" name="estoqueMinimo" value={form.estoqueMinimo} onChange={handleChange} placeholder="Estoque Mínimo" />
                    <input type="text" name="codigoBarras" value={form.codigoBarras} onChange={handleChange} placeholder="Código de Barras" />

                    <button type="submit">{isEditing ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
                    {isEditing && (
                        <button type="button" className="cancel-button" onClick={resetForm}>Cancelar Edição</button>
                    )}
                </form>
            </div>

            <div className="list-container">
                <h2>Lista de Produtos</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço Venda</th>
                        <th>Estoque</th>
                        <th>Ações</th> {/* Nova coluna */}
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
                                <button className="edit-button" onClick={() => handleEdit(produto)}>Editar</button>
                                <button className="delete-button" onClick={() => handleDelete(produto.id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GestaoProdutos;