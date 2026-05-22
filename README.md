# Wallet API
[![CI Pipeline](https://github.com/Mariano-JR/wallet-ledger-api/actions/workflows/ci.yml/badge.svg)](https://github.com/Mariano-JR/wallet-ledger-api/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node.js-20-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-framework-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-language-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-database-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/prisma-orm-2D3748)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/docker-container-2496ed)](https://www.docker.com/)

API REST de carteira digital multi-token com arquitetura baseada em ledger, permitindo rastreabilidade completa de transações financeiras.

## 🚀 Deploy

API em produção:
https://wallet-ledger-api.onrender.com

Documentação Swagger:
https://wallet-ledger-api.onrender.com/docs

## 🎯 Principais conceitos aplicados

- Ledger financeiro auditável (reconstrução de saldo via histórico)
- Idempotência em operações críticas
- Arquitetura modular com NestJS
- Conteinerização e Multi-stage Builds (Docker)
- Integração Contínua (CI/CD com GitHub Actions)
- Tratamento de erros consistente

## 🧾 Funcionalidades principais:

- Consulta de saldo da carteira
- Depósitos e saques
- Quotes de conversão entre tokens
- Execução de swaps entre moedas
- Histórico de transações com paginação
- Registro auditável de movimentações (ledger)

A API foi construída seguindo princípios de arquitetura modular e boas práticas de desenvolvimento backend.

## 🛠️ Tecnologias

- Node.js & NestJS
- TypeScript
- Prisma ORM & PostgreSQL
- Swagger (Documentação)
- Vitest (Testes Automatizados)
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## 📂 Estrutura do Projeto
```
├── prisma
│ ├── migrations
│ └── schema.prisma
├── src
│ ├── @types
│ ├── auth
│ ├── common
│ ├── ledger
│ ├── swap
│ ├── users
│ ├── wallet
│ ├── webhooks
│ ├── app.module.ts
│ ├── main.ts
│ ├── prisma.module.ts
│ └── prisma.service.ts    
```
### 🗃️ Organização

- **auth** → autenticação e geração de tokens  
- **wallet** → gerenciamento de carteira e saldo  
- **ledger** → registro de movimentações financeiras  
- **swap** → conversão entre tokens  
- **common** → utilidades compartilhadas  
- **prisma** → acesso ao banco de dados

## 💻 Como rodar o projeto

### 🐳 Opção 1: Via Docker (Recomendado)
```bash
# Constrói a imagem e sobe a API, o Banco de Dados e o Prisma Studio
docker compose up -d --build

# Executa as migrations para criar as tabelas no banco de dados
docker compose exec api npx prisma migrate deploy
```
- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- Prisma Studio: http://localhost:5555

### 💻 Opção 2: Instalação Manual
```bash
# Instalar dependências
npm install

# Rodar migrations do DB (requer PostgreSQL instalado localmente)
npx prisma migrate dev

# Iniciar o servidor
npm run start:dev
```

## 🗄️ Estrutura do Banco de Dados
O banco foi modelado para representar usuários, carteiras e transações.

### Tabelas principais:

**users**
```
userId
email
password
createdAt
```

**wallet**
```
walletId
userId
brlBalance
btcBalance
ethBalance
```

**transactions**
```
transactionId
walletId
groupId
idempotencyKey
type
token
amount
previousBalance
newBalance
createAt
```

Cada usuário possui uma carteira associada que armazena os saldos dos tokens.

Todas as alterações de saldo geram registros na tabela `transactions`, permitindo reconstruir o saldo da carteira a partir do histórico de movimentações (modelo de ledger auditável).
```
    User
     |
     | 1:1
     |
   Wallet
     |
     | 1:N
     |
Transactions
```

## 🎯 Decisões Técnicas

### NestJS
Escolhida por oferecer arquitetura modular, injeção de dependências e alta escalabilidade.

### Prisma
Facilidade de integração, tipagem automática com TypeScript e simplicidade para migrations.

### Docker & Multi-stage Build 
Uso de múltiplos estágios no Dockerfile para garantir um ambiente de desenvolvimento ágil com Compose e uma imagem final de produção extremamente leve e segura.

### GitHub Actions (CI)
Esteira automatizada para validar o build, as dependências e executar os testes a cada novo commit na branch principal, impedindo que código quebrado chegue em produção.

### Swagger
A documentação permite visualizar os endpoints disponíveis, seus parâmetros e testar as requisições diretamente pelo navegador.

### Idempotency
Operações sensíveis (depósitos/saques) utilizam `idempotencyKey` para evitar execução duplicada de requisições financeiras.

### Ledger Financeiro
O saldo não é apenas atualizado, mas reconstruído através de transações de SWAP, garantindo integridade e auditoria.
