# God Level Coder Challenge - Matheus Tavares

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node-dot-js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

### 🚀 Sobre o Projeto

Este projeto foi desenvolvido como parte do **Desafio God Level Coder Challenge**, com o objetivo de construir uma plataforma de **análise de métricas comerciais** que permite:

- Montar consultas personalizadas com métricas e dimensões.  
- Comparar períodos de tempo (ex: mês atual x mês anterior).  
- Salvar e compartilhar dashboards interativos.  
- Visualizar e analisar dados de forma clara, moderna e responsiva.

---

## 🧭 Funcionalidades

✅ **Builder de Análises**  
- Escolha métricas e dimensões personalizadas  
- Compare períodos distintos (ex: Outubro vs Setembro)  
- Gere tabelas dinâmicas com paginação  

✅ **Dashboards**  
- Salve análises completas  
- Reabra, edite e exclua dashboards  
- Compartilhe dashboards com link público  

✅ **Compartilhamento Público**  
- Gera link único e seguro (`/shares/:uuid`)  
- Permite apenas visualização (modo leitura)  

✅ **Filtros Avançados**  
- Intervalo de datas  
- Canal de venda  
- Comparação automática  

---

## 🧱 Arquitetura do Sistema

A aplicação segue o padrão **Cliente-Servidor**, com separação total entre:

| Camada | Tecnologias | Função |
|--------|--------------|--------|
| **Frontend** | React, Vite, TypeScript, TailwindCSS | Interface do usuário |
| **Backend** | Node.js, Express, TypeScript | Lógica de negócio e API REST |
| **Banco de Dados** | PostgreSQL | Armazenamento de dados e dashboards |

---

## 🗂️ Estrutura do Projeto

nola-analytics/
├── backend/

│ ├── src/

│ │ ├── controllers/ → Lógica de negócio

│ │ ├── routes/ → Definição das rotas REST

│ │ ├── db.ts → Conexão com PostgreSQL

│ │ └── index.ts → Inicialização do servidor

│ ├── package.json

│ └── tsconfig.json

│

├── frontend/

│ ├── src/

│ │ ├── components/ → Componentes reutilizáveis

│ │ ├── pages/ → Páginas principais

│ │ └── main.tsx → Roteamento da aplicação

│ ├── package.json

│ └── tailwind.config.ts

│

└── README.md


---

## 💾 Banco de Dados

Banco de dados: **PostgreSQL**

### Principais Tabelas:
- `sales` → Vendas realizadas  
- `products` → Produtos cadastrados  
- `channels` → Canais de venda  
- `dashboards` → Dashboards salvos  
- `shares` → Links de compartilhamento  

As queries utilizam **CTEs (Common Table Expressions)** para comparar períodos e calcular variações percentuais de forma otimizada.

---

## ⚙️ Backend (API REST)

O backend foi implementado com **Express + TypeScript**, seguindo princípios de **separação de responsabilidades**.

### 🔹 Endpoints Principais
| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/metrics/catalog` | Retorna catálogo de métricas e dimensões |
| `POST` | `/metrics/compare` | Gera comparação entre períodos |
| `POST` | `/dashboards` | Salva um dashboard |
| `GET` | `/dashboards` | Lista dashboards existentes |
| `POST` | `/shares` | Gera link único de compartilhamento |
| `GET` | `/shares/:token` | Retorna dashboard compartilhado |

---

## 💻 Frontend (Interface do Usuário)

O frontend foi criado com **React + Vite + TailwindCSS**, com foco em **simplicidade e performance**.

📁 Estrutura dos principais componentes:
- `Header` → Barra superior com ações (salvar/compartilhar)
- `FilterPanel` → Filtros de data, canal e comparação
- `ResultsPanel` → Renderiza tabelas dinâmicas com resultados
- `TableView` → Tabela com paginação e formatação de valores
- `SaveDashboardModal` e `ShareDashboardModal` → Modais interativos

---

## 🔗 Compartilhamento

Cada dashboard salvo pode ser compartilhado via um **link único (UUID)**:

https://localhost:5173/shares/{token}

Essa rota carrega automaticamente o dashboard e executa a análise em modo **somente leitura**.

---

## 🎨 Design & UI/UX

- Layout **minimalista e centrado nos dados**  
- Cores neutras com ênfase em azul e verde  
- Ícones **Lucide React**  
- Feedback visual com **Sonner (notificações)**  
- Paginação nas tabelas para performance  

---

## 🧩 Decisões Arquiteturais

### 1️⃣ **Stack Completa com TypeScript**
Escolha pelo **TypeScript** para segurança de tipos e facilidade de manutenção.

### 2️⃣ **API RESTful**
Permite modularidade e reuso, podendo ser consumida por qualquer cliente.

### 3️⃣ **Banco Relacional**
PostgreSQL facilita consultas complexas (CTEs e JOINs múltiplos).

### 4️⃣ **Frontend desacoplado**
Frontend independente do backend, facilitando deploys e escalabilidade.

### 5️⃣ **UX simplificada**
Interface moderna e leve, com navegação rápida via React Router.

---

## 🛠️ Como Rodar Localmente

### 1️⃣ Clonar o projeto
```bash
git clone https://github.com/MtAraujo/nola-analytics-matheus.git
cd nola-analytics-matheus

2️⃣ Instalar dependências
Backend

cd backend
npm install

Frontend

cd ../frontend
npm install

3️⃣ Configurar o .env no backend

DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
PORT=3000

4️⃣ Rodar o backend

npm run dev

5️⃣ Rodar o frontend

npm run dev

Frontend → http://localhost:5173
Backend → http://localhost:3000
```
👨‍💻 Autor

Matheus Tavares
