-- V2__Create_user_table_and_insert_users.sql
CREATE TABLE usuarios (
                          id SERIAL PRIMARY KEY,
                          login VARCHAR(255) NOT NULL UNIQUE,
                          senha VARCHAR(255) NOT NULL,
                          cargo VARCHAR(50) NOT NULL
);

-- -- Senha para todos é 'senha123' encriptada com BCrypt
-- -- Administrador
-- INSERT INTO usuarios (login, senha, cargo) VALUES ('admin', '$2a$10$3g.PCNIxKbQz.F5s7xP0G.7F.BfL2JcRsdAFJOMwzUgtPFF3WkdqC', 'ADMINISTRADOR');
-- -- Vendedor
-- INSERT INTO usuarios (login, senha, cargo) VALUES ('vendedor', '$2a$10$3g.PCNIxKbQz.F5s7xP0G.7F.BfL2JcRsdAFJOMwzUgtPFF3WkdqC', 'VENDEDOR');
-- -- Estoquista
-- INSERT INTO usuarios (login, senha, cargo) VALUES ('estoquista', '$2a$10$3g.PCNIxKbQz.F5s7xP0G.7F.BfL2JcRsdAFJOMwzUgtPFF3WkdqC', 'ESTOQUISTA');
