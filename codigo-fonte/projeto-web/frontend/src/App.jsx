import React, { useState, useEffect } from 'react';
import GestaoProdutos from './GestaoProdutos';
import Login from './Login';
import './GestaoProdutos.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <div className="App">
            {isAuthenticated ? (
                <GestaoProdutos />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
}

export default App;