# Nexus Wallet API
![Node.js](https://img.shields.io/badge/node.js-20-green)
![NestJS](https://img.shields.io/badge/nestjs-framework-red)
![TypeScript](https://img.shields.io/badge/typescript-language-blue)
![PostgreSQL](https://img.shields.io/badge/postgresql-database-blue)
![Prisma](https://img.shields.io/badge/prisma-orm-2D3748)
![Tests](https://img.shields.io/badge/tests-vitest-yellow)
![Architecture](https://img.shields.io/badge/architecture-modular_nestjs-blue)

API REST de carteira digital multi-token com arquitetura baseada em ledger, permitindo rastreabilidade completa de transações financeiras.

## Deploy

API em produção:
https://wallet-ledger-api.onrender.com

Documentação Swagger:
https://wallet-ledger-api.onrender.com/docs

## Principais conceitos aplicados

- Ledger financeiro auditável (reconstrução de saldo via histórico)
- Idempotência em operações críticas
- Arquitetura modular com NestJS
- Separação de responsabilidades
- Tratamento de erros consistente

## Funcionalidades principais:

- Consulta de saldo da carteira
- Depósitos e saques
- Quotes de conversão entre tokens
- Execução de swaps entre moedas
- Histórico de transações com paginação
- Registro auditável de movimentações (ledger)

A API foi construída seguindo princípios de arquitetura modular e boas práticas de desenvolvimento backend.

## Tecnologias

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger
- Vitest

## Estrutura do Projeto
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
### Organização

- **auth** → autenticação e geração de tokens  
- **wallet** → gerenciamento de carteira e saldo  
- **ledger** → registro de movimentações financeiras  
- **swap** → conversão entre tokens  
- **common** → utilidades compartilhadas  
- **prisma** → acesso ao banco de dados

## Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/nexus-teste-backend.git
cd nexus_teste_backend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Criar arquivo de ambiente
```bash
cp .env.example .env
```

### 4. Rodar migrations do DB
```bash
npx prisma migrate dev
```

### 5. Iniciar o servidor
```bash
npm run start:dev
```

### A API estará disponível em:
```
http://localhost:3000
```

## Variáveis de ambiente
O projeto utiliza variáveis de ambiente para configuração.

Crie um `.env` baseado no `.env.example`.

Exemplo:
```
PORT=3000
DATABASE_URL=connection_string
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## Documentação da API
A documentação interativa da API está disponível via Swagger:
```
http://localhost:3000/docs
```
Nela é possível testar todos os endpoints diretamente pelo navegador.

## Estrutura do Banco de Dados
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

## Decisões Técnicas

### NestJS
Escolhida por oferecer arquitetura modular e escalável, facilitando a organização da API.

### Prisma
Facilidade de integração, tipagem automática com TypeScript e simplicidade para migrations.

### Swagger
A documentação permite visualizar os endpoints disponíveis, seus parâmetros e testar as requisições diretamente pelo navegador.

### Idempotency
Operações sensíveis como depósitos e saques utilizam `idempotencyKey` para evitar execução duplicada de requisições.

### GroupId
Operações de swap geram múltiplas transações (SWAP_OUT, SWAP_FEE, SWAP_IN).  
O `groupId` permite agrupar essas movimentações como uma única operação lógica.
