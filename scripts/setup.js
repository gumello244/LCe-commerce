const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const rootDir = path.resolve(__dirname, '..')

console.log('🚀 Iniciando configuração do ambiente do projeto...\n')

// 1. Backend .env setup
const backendEnvTemplate = path.join(rootDir, 'apps', 'backend', '.env.template')
const backendEnv = path.join(rootDir, 'apps', 'backend', '.env')

if (!fs.existsSync(backendEnv)) {
  if (fs.existsSync(backendEnvTemplate)) {
    fs.copyFileSync(backendEnvTemplate, backendEnv)
    console.log('✅ Arquivo apps/backend/.env criado a partir de .env.template')
  } else {
    console.warn('⚠️  Arquivo apps/backend/.env.template não foi encontrado.')
  }
} else {
  console.log('ℹ️  Arquivo apps/backend/.env já existe. Mantido.')
}

// 2. Storefront .env.local setup
const storefrontEnvTemplate = path.join(rootDir, 'apps', 'storefront', '.env.template')
const storefrontEnv = path.join(rootDir, 'apps', 'storefront', '.env.local')

if (!fs.existsSync(storefrontEnv)) {
  if (fs.existsSync(storefrontEnvTemplate)) {
    fs.copyFileSync(storefrontEnvTemplate, storefrontEnv)
    console.log('✅ Arquivo apps/storefront/.env.local criado a partir de .env.template')
  } else {
    console.warn('⚠️  Arquivo apps/storefront/.env.template não foi encontrado.')
  }
} else {
  console.log('ℹ️  Arquivo apps/storefront/.env.local já existe. Mantido.')
}

// 3. Subir o Docker Compose
console.log('\n🐳 Iniciando containers Docker (PostgreSQL & Redis)...')
try {
  execSync('docker compose up -d', { stdio: 'inherit', cwd: rootDir })
  console.log('✅ Containers Docker iniciados com sucesso!')
} catch (error) {
  console.warn('\n⚠️  Não foi possível iniciar o Docker Compose automaticamente.')
  console.warn('   Verifique se o Docker Desktop está instalado e rodando em sua máquina.\n')
}

console.log('\n🎉 Configuração inicial concluída!')
console.log('\nPróximos passos recomendados:')
console.log(' 1. Execute as migrações do banco (se necessário):')
console.log('    cd apps/backend && npx medusa db:migrate')
console.log(' 2. Popule os dados iniciais:')
console.log('    npm run backend:seed')
console.log(' 3. Inicie o projeto:')
console.log('    npm run dev\n')
