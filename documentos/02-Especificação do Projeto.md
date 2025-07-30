# **Especificação do Projeto**

## **Perfis de Usuários**

A seguir, são detalhados os perfis de usuários que interagem com o sistema.

### Perfil: Administrador

| Atributo | Descrição |
| :--- | :--- |
| **Descrição** | O Administrador é geralmente o dono do negócio ou um gerente com acesso total ao sistema. Ele é responsável por configurar o sistema, gerenciar usuários, cadastrar produtos, supervisionar o estoque e analisar o desempenho geral das vendas através de relatórios. |
| **Necessidades** | \<ul\>\<li\>Ter uma visão completa de todas as operações (vendas, estoque, finanças).\</li\>\<li\>Poder cadastrar, editar e remover produtos e categorias.\</li\>\<li\>Controlar os níveis de estoque e ser alertado sobre a necessidade de reposição.\</li\>\<li\>Gerenciar as contas de outros usuários (vendedores, estoquistas).\</li\>\<li\>Acessar relatórios detalhados para tomada de decisão estratégica.\</li\>\</ul\> |

### Perfil: Vendedor / Caixa

| Atributo | Descrição |
| :--- | :--- |
| **Descrição** | O Vendedor ou Caixa é o usuário que opera o sistema no dia a dia, na frente de loja. Sua principal função é registrar as vendas de forma rápida e eficiente, lidar com pagamentos e consultar a disponibilidade de produtos no estoque. |
| **Necessidades** | \<ul\>\<li\>Uma interface rápida e intuitiva para registrar vendas (Ponto de Venda - PDV).\</li\>\<li\>Facilidade para buscar produtos (por nome ou código de barras).\</li\>\<li\>Processar diferentes formas de pagamento (dinheiro, cartão, Pix).\</li\>\<li\>Consultar o preço e a quantidade de um produto em estoque.\</li\>\<li\>Cadastrar clientes e associá-los a vendas.\</li\>\<li\>Fechar o caixa ao final do turno de trabalho.\</li\>\</ul\> |

### Perfil: Estoquista

| Atributo | Descrição |
| :--- | :--- |
| **Descrição** | O Estoquista é o responsável pelas operações do almoxarifado ou estoque. Ele gerencia a entrada de mercadorias, a organização física dos produtos, o registro de perdas e a realização de inventários para garantir a acuracidade dos dados no sistema. |
| **Necessidades** | \<ul\>\<li\>Registrar a entrada de produtos no estoque (geralmente via nota fiscal de compra).\</li\>\<li\>Dar baixa em produtos por motivos de perda, dano ou vencimento.\</li\>\<li\>Realizar a contagem física do estoque (inventário).\</li\>\<li\>Consultar a posição e a quantidade de qualquer item no estoque.\</li\>\</ul\> |

## **Histórias de Usuários**

As histórias de usuários a seguir descrevem as funcionalidades do sistema da perspectiva de quem o utiliza.

> **Link Útil**: [Como escrever boas histórias de usuário (User Stories)](https://medium.com/vertice/como-escrever-boas-users-stories-hist%C3%B3rias-de-usu%C3%A1rios-b29c75043fac)

| EU COMO... `QUEM` | QUERO/PRECISO ... `O QUE` | PARA ... `PORQUÊ` |
| :--- | :--- | :--- |
| **Administrador** | cadastrar novos produtos com nome, preço e quantidade inicial | manter meu catálogo organizado e o controle de estoque preciso desde o início. |
| **Administrador** | receber uma notificação visual | quando um produto atingir o estoque mínimo para que eu possa planejar a reposição e não perder vendas. |
| **Administrador** | visualizar um relatório de vendas por período (diário, semanal, mensal) | poder analisar o desempenho do negócio e identificar tendências. |
| **Administrador** | gerenciar os acessos dos outros usuários (vendedores, estoquistas) | garantir que apenas funcionários autorizados operem o sistema. |
| **Vendedor / Caixa** | registrar uma venda de forma rápida, escaneando ou buscando produtos | agilizar o atendimento ao cliente e reduzir filas no caixa. |
| **Vendedor / Caixa** | poder selecionar diferentes formas de pagamento para uma mesma venda | oferecer flexibilidade ao cliente na hora de pagar. |
| **Vendedor / Caixa** | consultar a quantidade de um produto em estoque diretamente na tela de vendas | informar ao cliente a disponibilidade de um item sem precisar sair do caixa. |
| **Vendedor / Caixa** | cadastrar as informações de um cliente (nome, contato) e associá-lo a uma venda | manter um histórico de compras e facilitar o relacionamento com o cliente. |
| **Estoquista** | registrar a entrada de mercadorias no sistema | para que o estoque reflita a quantidade correta de produtos disponíveis para venda. |
| **Estoquista** | dar baixa em produtos danificados ou vencidos, com um campo para justificativa | para manter a acuracidade do inventário e controlar as perdas. |
| **Estoquista** | gerar uma lista de contagem de estoque (inventário) | para poder verificar o estoque físico contra o que está registrado no sistema e corrigir discrepâncias. |

## **Requisitos do Projeto**

Com base nas Histórias de Usuários, são enumerados os requisitos da solução.

### **Requisitos Funcionais**

| ID | Descrição | Prioridade |
| :--- | :--- | :--- |
| RF-01 | O sistema deve permitir o cadastro de usuários com três níveis de permissão: Administrador, Vendedor/Caixa e Estoquista. | **Alta** |
| RF-02 | O sistema deve permitir ao Administrador cadastrar, editar e excluir produtos, informando no mínimo: código, nome, preço de venda e estoque inicial. | **Alta** |
| RF-03 | O sistema deve possuir uma tela de Ponto de Venda (PDV) para o usuário Vendedor/Caixa. | **Alta** |
| RF-04 | A tela de PDV deve permitir a busca de produtos por nome ou código. | **Alta** |
| RF-05 | O sistema deve abater automaticamente a quantidade do estoque após a conclusão de uma venda. | **Alta** |
| RF-06 | O sistema deve suportar o registro de vendas com as seguintes formas de pagamento: Dinheiro, Cartão de Crédito, Cartão de Débito e Pix. | **Alta** |
| RF-07 | O sistema deve permitir ao Administrador definir um nível de "estoque mínimo" para cada produto. | Média |
| RF-08 | O sistema deve exibir um alerta visual para o Administrador para produtos que atingiram o estoque mínimo. | Média |
| RF-09 | O sistema deve gerar um relatório de vendas filtrando por um intervalo de datas selecionável. | **Alta** |
| RF-10 | O sistema deve permitir ao Estoquista registrar a entrada de produtos no estoque, atualizando a sua quantidade. | **Alta** |
| RF-11 | O sistema deve permitir ao Estoquista registrar baixas de estoque por motivo de perda/dano, exigindo uma justificativa. | Média |
| RF-12 | O sistema deve permitir o cadastro de clientes com, no mínimo, nome e telefone/email. | Média |
| RF-13 | O sistema deve permitir associar um cliente cadastrado a uma venda no momento do registro no PDV. | Média |
| RF-14 | O sistema deve permitir a geração de um relatório de contagem de estoque (inventário) para conferência física. | Baixa |
| RF-15 | O sistema deve permitir que o usuário Vendedor/Caixa execute uma rotina de "fechamento de caixa". | Média |
| RF-16 | O sistema deve permitir a consulta rápida de estoque na tela de vendas. | Média |

### **Requisitos não Funcionais**

| ID | Descrição | Prioridade |
| :--- | :--- | :--- |
| RNF-01 | O sistema deve ser acessível através de um navegador web padrão (Google Chrome, Firefox, Safari). | **Alta** |
| RNF-02 | O tempo de resposta para adicionar um produto na venda e para finalizar a venda não deve exceder 2 segundos. | **Alta** |
| RNF-03 | O acesso ao sistema deve ser protegido por autenticação de usuário e senha. As senhas devem ser armazenadas de forma criptografada no banco de dados. | **Alta** |
| RNF-04 | A interface do usuário deve ser intuitiva e seguir um padrão consistente em todas as telas, minimizando a necessidade de treinamento extensivo. | **Alta** |
| RNF-05 | O sistema deve ser capaz de operar com um volume de até 10.000 produtos e 100 vendas por dia sem degradação de performance. | Média |
| RNF-06 | O sistema deve realizar backups diários automáticos do banco de dados para prevenir perda de dados. | Média |
