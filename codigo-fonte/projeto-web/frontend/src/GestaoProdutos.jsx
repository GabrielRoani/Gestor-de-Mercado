import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GestaoProdutos.css'; // Vamos criar este ficheiro para o estilo

const API_URL = 'http://localhost:8080/api';

function GestaoProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [form, setForm] = useState({
        nome: '',
        precoVenda: '',
        quantidadeEstoque: '',
    });

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

    // Função para lidar com mudanças nos inputs do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // Função para submeter o formulário e criar um novo produto
    const handleSubmit = (e) => {
        e.preventDefault();
        const novoProduto = {
            ...form,
            precoVenda: form.precoVenda.replace(',', '.'), // Garante o formato correto
            // Valores padrão para os outros campos
            precoCusto: "0.00",
            codigoBarras: Date.now().toString(),
            estoqueMinimo: 0,
            unidadeMedida: "UN"
        };

        axios.post(`${API_URL}/produtos`, novoProduto)
            .then(() => {
                alert('Produto criado com sucesso!');
                setForm({ nome: '', precoVenda: '', quantidadeEstoque: '' }); // Limpa o formulário
                carregarProdutos(); // Recarrega a lista de produtos
            })
            .catch(error => console.error("Erro ao criar produto:", error));
    };

    return (
        <div className="container">
            <h1>Gestão de Produtos Conectta</h1>

            <div className="form-container">
                <h2>Adicionar Novo Produto</h2>
                <form onSubmit={handleSubmit}>
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

            <div className="list-container">
                <h2>Lista de Produtos</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Stock</th>
                    </tr>
                    </thead>
                    <tbody>
                    {produtos.map(produto => (
                        <tr key={produto.id}>
                            <td>{produto.id}</td>
                            <td>{produto.nome}</td>
                            <td>R$ {parseFloat(produto.precoVenda).toFixed(2)}</td>
                            <td>{produto.quantidadeEstoque}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GestaoProdutos;