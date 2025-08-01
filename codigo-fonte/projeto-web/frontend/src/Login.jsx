// src/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

function Login({ onLoginSuccess }) {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Limpa o erro anterior

        axios.post(`${API_URL}/login`, { login, senha })
            .then(response => {
                console.log("Login bem-sucedido!", response.data); // Mostra a resposta de sucesso
                onLoginSuccess();
            })
            .catch(err => {
                // ** Lógica de diagnóstico melhorada **
                if (err.response) {
                    // O servidor respondeu com um status de erro (4xx ou 5xx)
                    console.error("Erro de resposta do servidor:", err.response.data);
                    setError(`Erro: ${err.response.status} - ${err.response.data.message || 'Login ou senha inválidos.'}`);
                } else if (err.request) {
                    // A requisição foi feita, mas não houve resposta
                    console.error("Nenhuma resposta recebida:", err.request);
                    setError("Não foi possível conectar ao servidor. Verifique a sua conexão.");
                } else {
                    // Algo deu errado ao configurar a requisição
                    console.error("Erro ao configurar a requisição:", err.message);
                    setError("Ocorreu um erro inesperado.");
                }
            });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Login"
                        required
                    />
                    <input
                        type="password"
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                    <button type="submit">Entrar</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;