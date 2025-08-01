-- Tabela para armazenar as vendas
CREATE TABLE vendas (
                        id SERIAL PRIMARY KEY,
                        data_venda TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        valor_total NUMERIC(10, 2) NOT NULL,
                        metodo_pagamento VARCHAR(50) NOT NULL,
                        usuario_id INTEGER NOT NULL,
                        CONSTRAINT fk_usuario
                            FOREIGN KEY(usuario_id)
                                REFERENCES usuarios(id)
);

-- Tabela para os itens de cada venda
CREATE TABLE itens_venda (
                             id SERIAL PRIMARY KEY,
                             venda_id INTEGER NOT NULL,
                             produto_id INTEGER NOT NULL,
                             quantidade INTEGER NOT NULL,
                             preco_unitario NUMERIC(10, 2) NOT NULL,
                             subtotal NUMERIC(10, 2) NOT NULL,
                             CONSTRAINT fk_venda
                                 FOREIGN KEY(venda_id)
                                     REFERENCES vendas(id),
                             CONSTRAINT fk_produto
                                 FOREIGN KEY(produto_id)
                                     REFERENCES produtos(id)
);