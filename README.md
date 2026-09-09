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

## Variáveis de Ambiente & Integrações em Nuvem

O projeto utiliza **Supabase** como banco PostgreSQL gerenciado e **Cloudflare R2** como storage de mídia (compatível com S3).

---

### 1. Supabase (Banco de Dados PostgreSQL)

No Supabase, as conexões diretas utilizam apenas IPv6 no plano gratuito, o que pode causar erros `ENOTFOUND` em várias redes e máquinas Windows. Por isso, **sempre utilize a URL do Connection Pooler (Session Mode)**:

1. Acesse o painel do [Supabase](https://supabase.com/dashboard) e entre no seu projeto.
2. No topo, clique em **Connect** (ou vá em **Project Settings** > **Database**).
3. Selecione a aba **Connection Pooler** (ou Connection String > Pooler).
4. Escolha o modo: **Session** na porta **`5432`** *(não use a porta 6543/Transaction para migrations)*.
5. Copie a URI gerada. Ela terá este formato:
   ```env
   DATABASE_URL=postgres://postgres.<PROJECT_REF>:<SUA_SENHA>@aws-0-<REGIAO>.pooler.supabase.com:5432/postgres?sslmode=require
   ```
> **Pontos de atenção:**
> - Remova os colchetes `[` e `]` ao substituir a sua senha.
> - Se a senha tiver símbolos especiais (como `@`, `#`), faça o URL-encode deles ou defina uma senha apenas alfanumérica no Supabase (**Project Settings** > **Database** > **Reset database password**).
> - Se o projeto estiver pausado por inatividade no Supabase, clique em **Restore project** antes de rodar.

---

### 2. Cloudflare R2 (Armazenamento de Fotos e Mídia)

O R2 armazena imagens de produtos, banners e uploads da loja.

1. Acesse o painel da [Cloudflare](https://dash.cloudflare.com/) e entre em **R2**.
2. **Account ID & Endpoint**: Na página principal do R2, na coluna lateral direita (**Account Details**), você verá seu **Account ID**.
   - `R2_ENDPOINT`: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
3. **Credenciais de API**:
   - Clique em **Manage R2 API Tokens** > **Create API Token**.
   - Permissão: **Object Read & Write**.
   - Copie o **Access Key ID** (`R2_ACCESS_KEY_ID`) e o **Secret Access Key** (`R2_SECRET_ACCESS_KEY`).
4. **Bucket e URL Pública**:
   - Crie ou selecione o Bucket (`R2_BUCKET`).
   - Vá na aba **Settings** do bucket > seção **Public Access**.
   - Ative o **R2.dev subdomain** (clique em *Allow Access*) **OU** conecte um domínio próprio (**Custom Domains**).
   - A URL gerada será o seu `R2_FILE_URL` (ex: `https://pub-xxxxxxxx.r2.dev` ou `https://cdn.seusite.com`).

---

### Exemplo de Configuração dos Arquivos `.env`

#### Backend: `apps/backend/.env`
```env
MEDUSA_ADMIN_ONBOARDING_TYPE=nextjs
STORE_CORS=http://localhost:8000,https://docs.medusajs.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com
JWT_SECRET=supersecret_troque_se_quiser
COOKIE_SECRET=supersecret_troque_se_quiser

# Supabase (Connection Pooler - Porta 5432)
DATABASE_URL=postgres://postgres.<PROJECT_REF>:<SENHA>@aws-0-<REGIAO>.pooler.supabase.com:5432/postgres?sslmode=require

# Cloudflare R2
R2_FILE_URL=https://pub-xxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
R2_ACCESS_KEY_ID=seu_access_key_id
R2_SECRET_ACCESS_KEY=seu_secret_access_key
R2_REGION=auto
R2_BUCKET=seu-bucket-name
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

#### Storefront: `apps/storefront/.env.local`
```env
# Publishable API Key gerada no banco Medusa
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=br
NODE_ENV=development
```

> 💡 **Como obter a `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`:**
> Se estiver configurando uma máquina nova conectada a um banco já populado, você pode descobrir a chave pública existente executando no backend:
> ```bash
> cd apps/backend && npx medusa exec ./src/scripts/get-publishable-key.ts
> ```
> Copie o token (`pk_...`) e cole no `.env.local` do storefront.

---

## Passo a Passo para Rodar em um Novo Computador

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd LCe-commerce

# 2. Instalar dependências
npm install

# 3. Criar os arquivos de ambiente
# Copie apps/backend/.env.template para apps/backend/.env e preencha com o Supabase e Cloudflare
# Copie apps/storefront/.env.template para apps/storefront/.env.local e configure a publishable key

# 4. (Apenas se o banco estiver vazio / primeira vez) Rodar migrações
cd apps/backend
npx medusa db:migrate

# 5. Criar usuário administrador para o painel
npx medusa user -e seu-email@exemplo.com -p suaSenha123

# 6. Rodar o projeto completo (da raiz)
cd ../..
npm run dev
```

- 🛒 **Storefront (Loja)**: [http://localhost:8000](http://localhost:8000)
- ⚙️ **Painel Admin**: [http://localhost:9000/app](http://localhost:9000/app)

---

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

