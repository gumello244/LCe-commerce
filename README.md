# Louise Castelatto — E-commerce

Plataforma de e-commerce **Louise Castelatto**, construída em monorepo com [Medusa](https://medusajs.com) no backend e [Next.js](https://nextjs.org) no storefront.

## Estrutura do Projeto

```text
.
├── apps/
│   ├── backend/      # API Medusa + painel admin (porta 9000)
│   └── storefront/   # Loja Next.js (porta 8000)
├── turbo.json
└── package.json
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [PostgreSQL](https://www.postgresql.org/) v15+
- npm v11+

## Instalação Local (Quick Start)

### 1. Clone o repositório e instale as dependências

```bash
git clone <url-do-repositorio>
cd LCe-commerce
npm install
```

### 2. Execute o Setup Automatizado

```bash
npm run setup
```
> O script cria os arquivos `.env` e `.env.local` automaticamente e inicializa os containers Docker (PostgreSQL e Redis).

### 3. Execute as migrations e popule o banco (se primeira vez)

```bash
cd apps/backend && npx medusa db:migrate
npm run backend:seed
```

### 4. Inicie o projeto completo

```bash
npm run dev
```

A loja estará disponível em `http://localhost:8000` e o backend/admin em `http://localhost:9000`.

---

## Scripts Disponíveis

Execute os comandos abaixo a partir da **raiz** do monorepo:

| Comando | Descrição |
|---|---|
| `npm run setup` | Copia `.env` templates e inicia containers Docker |
| `npm run dev` | Inicia backend e storefront em modo desenvolvimento |
| `npm run backend:dev` | Inicia apenas o backend |
| `npm run storefront:dev` | Inicia apenas o storefront |
| `npm run build` | Faz o build de todos os apps |
| `npm run lint` | Executa o linter em todos os apps |
| `npm run test` | Executa os testes do backend |

## Variáveis de Ambiente

### Backend (`apps/backend/.env`)

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão com o PostgreSQL |
| `JWT_SECRET` | Segredo para tokens JWT |
| `COOKIE_SECRET` | Segredo para cookies de sessão |
| `STORE_CORS` | Origens permitidas para a loja |
| `ADMIN_CORS` | Origens permitidas para o painel admin |
| `AUTH_CORS` | Origens permitidas para autenticação |

### Storefront (`apps/storefront/.env.local`)

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Chave pública da API Medusa | — |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | URL do backend Medusa | `http://localhost:9000` |
| `NEXT_PUBLIC_BASE_URL` | URL base do storefront | `http://localhost:8000` |
| `NEXT_PUBLIC_STRIPE_KEY` | Chave pública do Stripe (opcional) | — |

## Testes (Backend)

```bash
# Testes unitários
cd apps/backend
npm run test:unit

# Testes de integração — módulos
npm run test:integration:modules

# Testes de integração — HTTP
npm run test:integration:http
```

> Os testes de integração requerem um banco PostgreSQL acessível.

## Recursos

- [Documentação Medusa](https://docs.medusajs.com)
- [Documentação Next.js](https://nextjs.org/docs)
