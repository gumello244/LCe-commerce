# Louise Castelatto — E-commerce

Plataforma de e-commerce da **Louise Castelatto**, construída em monorepo com [Medusa](https://medusajs.com) no backend e [Next.js](https://nextjs.org) no storefront.

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

## Instalação Local

### 1. Clone o repositório e instale as dependências

```bash
git clone <url-do-repositorio>
cd LCe-commerce
npm install
```

### 2. Configure as variáveis de ambiente do backend

```bash
cp apps/backend/.env.template apps/backend/.env
```

Edite `apps/backend/.env` e defina a URL do banco de dados:

```env
DATABASE_URL=postgres://postgres:@localhost:5432/louise-castelatto
```

### 3. Execute as migrations

```bash
cd apps/backend
npx medusa db:migrate
```

### 4. Crie o usuário administrador

```bash
cd apps/backend
npx medusa user -e admin@email.com -p suasenha
```

### 5. Inicie o backend

```bash
cd apps/backend
npm run dev
```

Acesse o painel admin em `http://localhost:9000/app`.
Em **Settings → Publishable API Key**, copie a chave pública.

### 6. Configure as variáveis de ambiente do storefront

```bash
cp apps/storefront/.env.local.template apps/storefront/.env.local
```

Edite `apps/storefront/.env.local`:

```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### 7. Inicie o storefront

```bash
cd apps/storefront
npm run dev
```

A loja estará disponível em `http://localhost:8000`.

---

> **Atalho:** Para rodar backend e storefront simultaneamente a partir da raiz:
>
> ```bash
> npm run dev
> ```

## Scripts Disponíveis

Execute os comandos abaixo a partir da **raiz** do monorepo:

| Comando | Descrição |
|---|---|
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
