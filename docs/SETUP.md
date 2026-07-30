# Setup Local — Fase 1

**Objetivo**: Rodar o projeto localmente com Docker Compose

---

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para IDEs, se quiser)
- pnpm (gerenciador de pacotes)

---

## Primeiros Passos

### 1. Clonar e Instalar Dependências

```bash
# Clonar repositório
git clone <repo> site-lavajato
cd site-lavajato

# Instalar dependências do workspace
pnpm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# .env já tem valores padrão para dev
# Não precisa alterar para começar
```

### 3. Iniciar Docker Compose

```bash
# Subir containers (PostgreSQL, API, Web)
docker-compose up

# Primeira vez: Vai demorar um pouco (build das imagens)
# Próximas vezes: Muito rápido
```

### 4. Aplicar Migrations

```bash
# Em outro terminal:
pnpm migrate

# Isso:
# 1. Cria as tabelas no PostgreSQL
# 2. Gera o Prisma Client
```

### 5. Acessar Aplicação

```
Frontend: http://localhost:3000
API:      http://localhost:3001
API Health: http://localhost:3001/health
```

---

## Comandos Principais

```bash
# Iniciar ambiente
pnpm dev

# Parar
pnpm dev:stop

# Migrations
pnpm migrate          # Criar nova migration
pnpm migrate:prod     # Aplicar em produção

# Desenvolvimento
cd apps/api && pnpm dev        # Rodar só API
cd apps/web && pnpm dev        # Rodar só Web

# Qualidade
pnpm lint             # ESLint em tudo
pnpm type-check       # TypeScript check
pnpm test             # Testes

# Build
pnpm build            # Build dos apps
```

---

## Estrutura de Diretórios

```
site-lavajato/
├── apps/
│   ├── api/           # Backend NestJS (porta 3001)
│   └── web/           # Frontend Next.js (porta 3000)
├── packages/          # Código compartilhado (types, validation)
├── docs/              # Documentação
├── infrastructure/    # Docker, Nginx, scripts
└── docker-compose.yml # Orquestração local
```

---

## Troubleshooting

### Docker não sobe

```bash
# Limpar containers e volumes
docker-compose down -v

# Tentar novamente
docker-compose up
```

### Port já em uso

Se a porta 3000, 3001 ou 5432 já estiver em uso:

```bash
# Editar docker-compose.yml e trocar as portas
# Ex: "3002:3000" ao invés de "3000:3000"
```

### Migrations falhando

```bash
# Verificar se PostgreSQL está pronto
docker-compose logs postgres

# Se conectar manualmente:
psql postgresql://lavajato:password@localhost:5432/lavajato
```

### Limpar tudo e começar do zero

```bash
docker-compose down -v
docker system prune -a
docker-compose up
pnpm install
pnpm migrate
```

---

## Próximos Passos

Depois de ter tudo rodando:

1. Explorar a estrutura de diretórios
2. Ler [ARCHITECTURE_SINGLE_TENANT.md](ARCHITECTURE_SINGLE_TENANT.md)
3. Começar a implementar features (Fase 2)

---

## Dúvidas?

- Verificar logs: `docker-compose logs -f api`
- Ver status: `docker-compose ps`
- Acessar container: `docker-compose exec api sh`
