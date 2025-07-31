-- Tabela para armazenar os produtos
CREATE TABLE produtos (
                          id SERIAL PRIMARY KEY,
                          codigo_barras VARCHAR(255) UNIQUE,
                          nome VARCHAR(255) NOT NULL,
                          preco_venda NUMERIC(10, 2) NOT NULL,
                          preco_custo NUMERIC(10, 2),
                          quantidade_estoque INTEGER NOT NULL DEFAULT 0,
                          estoque_minimo INTEGER NOT NULL DEFAULT 0,
                          unidade_medida VARCHAR(10) DEFAULT 'UN'
);

-- Tabela para o histórico de movimentações de estoque
CREATE TABLE movimentacoes_estoque (
                           id SERIAL PRIMARY KEY,
                           produto_id INTEGER NOT NULL,
                           tipo_movimentacao VARCHAR(50) NOT NULL,
                           quantidade INTEGER NOT NULL,
                           data_movimentacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           usuario_id INTEGER,
                           justificativa TEXT,
                           CONSTRAINT fk_produto
                               FOREIGN KEY(produto_id)
                                   REFERENCES produtos(id)
);