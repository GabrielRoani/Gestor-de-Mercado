#  Sistema de Controle de Estoque e PDV (Arquitetura de Microsserviços)

![Badge de Status](https://img.shields.io/badge/status-em--desenvolvimento-yellow)
![Badge de Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

Um projeto acadêmico e de portfólio para a criação de um sistema completo de gestão de estoque e ponto de venda (PDV), utilizando uma arquitetura moderna, vasta, muito bem distribuída e poliglota para simular um ambiente de desenvolvimento de software do mundo real.

---

## 🏛️ Arquitetura

A solução é baseada em uma arquitetura de microsserviços. Os componentes são independentes, escaláveis e se comunicam através de APIs REST, permitindo o uso da tecnologia mais adequada para cada tarefa.

![Diagrama da Arquitetura]([COLE_AQUI_O_LINK_DA_IMAGEM_DO_DIAGRAMA_QUE_VOCE_SALVOU])
*O diagrama acima ilustra a interação entre o Frontend, o Backend, o Serviço de Análise e o Banco de Dados.*

---

## 🛠️ Stack de Tecnologias

Este projeto utiliza uma variedade de tecnologias, separadas por componente:

| Componente             | Tecnologias Principais                                |
| ---------------------- | ----------------------------------------------------- |
| **Backend API Core** | Java 17, SDK Eclipse Temurin |
| **Frontend Web** | JavaScript, React.js|
| **Serviço de Análise** | Python 3.9+, Flask (ou FastAPI), Pandas, Matplotlib |
| **Banco de Dados** | MySQL 8                                               |
| **Ferramentas Gerais** | Git, GitHub, Docker, Postman  |

---

## ✨ Funcionalidades

### Funcionalidades Planejadas:
-   [ ] **Autenticação de Usuários:** Login com JWT e controle de acesso por papel (Admin, Caixa, Estoquista).
-   [ ] **Módulo de Gestão:** CRUD completo de Produtos, Categorias e Fornecedores.
-   [ ] **Módulo de Estoque:** Registro de entrada de mercadorias, ajustes manuais (perdas e quebras).
-   [ ] **Módulo PDV:** Interface de Ponto de Venda para registro de vendas, consulta de preços e pagamentos (simulados).
-   [ ] **Módulo de Relatórios:**
    -   [ ] Relatórios simples (posição de estoque, produtos a vencer).
    -   [ ] Relatórios analíticos com gráficos (Curva ABC, histórico de vendas) via serviço Python.

---

## 🚀 Como Executar o Projeto

Para executar este projeto localmente, você precisará ter o ambiente de cada serviço configurado.

### Pré-requisitos:
* [Git](https://git-scm.com/)
* [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
* [Maven 3.8+](https://maven.apache.org/download.cgi)
* [Node.js 18+](https://nodejs.org/)
* [Python 3.9+](https://www.python.org/downloads/)
* [MySQL Server 8](https://dev.mysql.com/downloads/mysql/)
* Um cliente de API como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/)

### Passos para Instalação:

1.  **Clone o repositório:**
    ```bash
    git clone [LINK_DO_SEU_REPOSITORIO_AQUI]
    cd [NOME_DA_PASTA_DO_PROJETO]
    ```

2.  **Configure o Banco de Dados:**
    * Acesse seu cliente MySQL.
    * Crie um novo banco de dados para o projeto: `CREATE DATABASE seu_mercado_db;`
    * É recomendado criar um usuário específico para a aplicação.

3.  **Configure os Serviços (Variáveis de Ambiente):**
    * Cada serviço (`backend-core`, `analytics-service`, etc.) terá um arquivo de configuração para variáveis de ambiente (ex: `application.properties` para o Spring ou `.env` para Node/Python).
    * Configure as credenciais do banco de dados no serviço de backend e as URLs das APIs nos serviços que as consomem.

4.  **Execute o Backend (Java):**
    ```bash
    cd backend-core/ # ou o nome da pasta do seu serviço Java
    mvn spring-boot:run
    ```
    *A API estará disponível em `http://localhost:8080`.*

5.  **Execute o Frontend (JavaScript):**
    ```bash
    cd frontend-web/ # ou o nome da pasta do seu serviço JS
    npm install
    npm start
    ```
    *A aplicação estará visível em `http://localhost:3000`.*

6.  **Execute o Serviço de Análise (Python):**
    ```bash
    cd analytics-service/ # ou o nome da pasta do seu serviço Python
    pip install -r requirements.txt
    flask run
    ```
    *O serviço de relatórios estará disponível em `http://localhost:5000`.*

---

## 🤝 Colaboradores

Este projeto está sendo desenvolvido com muito empenho por:

| Nome                  | GitHub                                       |
| --------------------- | -------------------------------------------- |
| **Gabriel C. Roani** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/GabrielRoani) |
| **Marcelo G. Chies** | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MarceloChies) |


---

## 📜 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
