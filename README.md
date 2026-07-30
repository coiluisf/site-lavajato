# Site Lavajato

**Sistema de Gestão Multi-Tenant para Lava-Jatos**

> Uma plataforma online profissional para controle e gestão de operações de lava-jatos com isolamento multi-tenant, autenticação segura e experiência otimizada para operação em mobile.

**Status**: 🔨 Fase 0 — Arquitetura e Planejamento (Completo)  
**Próxima Fase**: Fase 1 — Fundação (Em Planejamento)

---

## 📋 Visão Geral

### O que é?

Site Lavajato é uma plataforma web SaaS para gerenciar múltiplos lava-jatos sob uma única aplicação. Cada lava-jato funciona de forma completamente isolada, com seus próprios usuários, dados, configurações e relatórios.

### Para Quem?

- **Proprietários de lava-jatos** que precisam organizar operações (agendamento, ordens, pagamentos)
- **Gerentes** que acompanham o dia-a-dia operacional
- **Funcionários** (atendentes, lavadores) que registram serviços
- **Financeiro** que controla caixa, despesas e comissões

### Características Principais

✅ **Multi-Tenant**: Múltiplas empresas em uma aplicação
✅ **Isolado**: Dados de uma empresa nunca são vistos por outra
✅ **Seguro**: Autenticação com JWT + refresh rotativo
✅ **Responsivo**: Funciona em desktop, tablet, celular
✅ **Rápido**: Operado com pressa em ambiente de movimento
✅ **Auditado**: Log de ações, especialmente modo de suporte
✅ **Operacional**: Foco em fluxo de trabalho real

---

## 🏗️ Arquitetura

### Stack Tecnológico

```
Frontend:     Next.js 14+ (React + TypeScript + Tailwind + shadcn/ui)
Backend:      NestJS + TypeScript + Prisma
Database:     PostgreSQL (ACID, constraints, RLS)
Infraestrutura: Docker + Docker Compose + Nginx
Monorepo:     pnpm workspaces
```

### Estrutura de Repositório

```
site-lavajato/
├── apps/
│   ├── web/              # Frontend Next.js
│   └── api/              # Backend NestJS
├── packages/
│   ├── types/            # Tipos TypeScript compartilhados
│   ├── validation/       # Schemas Zod compartilhados
│   └── ui/               # Componentes UI customizados
├── infrastructure/       # Docker, Nginx, scripts
├── docs/                 # Documentação de arquitetura
└── README.md            # Este arquivo
```

---

## 📚 Documentação

### Fase 0 (Arquitetura)

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Visão geral da arquitetura, decisões, estrutura
- **[PHASES.md](docs/PHASES.md)** — Divisão em 8 fases de desenvolvimento
- **[MULTI_TENANCY.md](docs/MULTI_TENANCY.md)** — Estratégia de isolamento de dados
- **[AUTHENTICATION.md](docs/AUTHENTICATION.md)** — Fluxo de autenticação, tokens, segurança
- **[DECISIONS.md](docs/DECISIONS.md)** — Log de decisões arquiteturais (tomadas e pendentes)

### Próximos Documentos (Fase 1+)

- `DATABASE.md` — Schema detalhado, migrations, índices
- `API_GUIDE.md` — Padrões de API, DTOs, respostas
- `SETUP.md` — Instruções de setup local
- `SECURITY.md` — Checklist de segurança completo
- `DEPLOY.md` — Como fazer deploy em produção

---

## 🎯 Fases de Desenvolvimento

| Fase | Foco | Duração |
|------|------|---------|
| **0** | Arquitetura e Planejamento | ✅ Completo |
| **1** | Fundação (Monorepositório, Docker, DB) | 2-3 semanas |
| **2** | Autenticação, Empresas, Usuários, Permissões | 2-3 semanas |
| **3** | Cadastros (Clientes, Veículos, Serviços) | 2 semanas |
| **4** | Operação (Agenda, Ordens, Fila, Checklist) | 3-4 semanas |
| **5** | Financeiro (Caixa, Pagamentos, Despesas) | 2 semanas |
| **6** | Estoque e Comissões | 2 semanas |
| **7** | Relatórios, Responsividade, Acabamento | 2-3 semanas |
| **8** | Produção (Deploy, Monitoring, Backups) | 1-2 semanas |

**Estimativa Total**: 16-21 semanas (~5 meses)

---

## 🔒 Segurança

### Autenticação

- JWT com access token curto (15 min) + refresh rotativo (7 dias)
- Senhas com Argon2id (não MD5, SHA1 ou bcrypt)
- Rate limiting em login (5 tentativas / 15 min)
- Bloqueio temporário (15 min) após limite

### Isolamento Multi-Tenant

- `companyId` validado em TODAS as queries
- Validação em 3 camadas: Guard → Service → Database
- PostgreSQL Row-Level Security como defesa adicional (Fase 2+)
- Testes automáticos de isolamento obrigatórios
- Nenhum vazamento de dados entre empresas

### Autorização

- 5 papéis iniciais (OWNER, MANAGER, ATTENDANT, WASHER, FINANCE)
- Sistema extensível de permissões
- Guards de autorização em todas as rotas sensíveis
- Auditoria de ações críticas

### Modo de Suporte

- Admin não "furta" senha do cliente
- Sessão de suporte explícita com motivo
- Identidade do admin preservada em logs
- Faixa visual indicando modo de suporte

---

## 🚀 Quick Start (Próximo)

### Pré-requisitos (Fase 1)

```bash
# Será necessário:
- Docker e Docker Compose
- Node.js 18+
- pnpm
- Git
```

### Setup Local (Fase 1)

```bash
# Clonar repositório
git clone <repo> site-lavajato
cd site-lavajato

# Instalar dependências
pnpm install

# Iniciar containers Docker
docker-compose up

# Migrations do banco
npm run migrate

# Seed de dados de teste
npm run seed

# Iniciar dev servers
npm run dev
```

Aplicação estará disponível em:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- PostgreSQL: localhost:5432

---

## 📊 Modelo de Dados (Fase 1)

### Entidades Iniciais

**Plataforma** (compartilhadas):
- `companies` — Catálogo de lava-jatos
- `users` — Credenciais de clientes
- `platform_admins` — Administradores da plataforma
- `roles`, `permissions` — Templates de papéis
- `audit_logs` — Auditoria centralizada

**Negócio** (isoladas por empresa):
- `company_settings` — Configurações da empresa
- `customers` — Clientes
- `vehicles` — Veículos dos clientes
- `vehicle_categories` — Categorias (Sedã, SUV, etc)
- `services` — Serviços oferecidos
- `service_prices` — Preços por serviço + categoria
- `employees` — Funcionários

Veja [ARCHITECTURE.md#11-modelo-de-dados-inicial](docs/ARCHITECTURE.md#11-modelo-de-dados-inicial) para schema completo.

---

## 🛠️ Desenvolvimento

### Padrões de Código

- **TypeScript strict** — Sem `any`
- **NestJS modules** — Organização por domínio
- **Zod schemas** — Validação type-safe
- **DTOs validados** — Todas as entradas
- **Testes obrigatórios** — Isolamento, autorização, fluxos críticos
- **Sem hardcoding** — Configurações em .env

### Como Contribuir (Futuro)

1. Criar branch a partir de `develop`
2. Fazer commit com mensagens claras
3. Abrir PR com descrição detalhada
4. Passar em testes + linting + review
5. Mergear para develop → main (deploy automático)

---

## 🐛 Problemas Conhecidos

Nenhum ainda. Sistema ainda está em fase de design.

---

## 📞 Suporte

### Questões sobre Arquitetura

Veja [docs/DECISIONS.md#decisões-pendentes](docs/DECISIONS.md#decisões-pendentes) para decisões pendentes.

### Problemas de Desenvolvimento

Será documentado em TROUBLESHOOTING.md (Fase 1+)

---

## 📄 Licença

Privado — Desenvolvido para uso específico do cliente.

---

## 👤 Autor

Engenheiro de Software Sênior (IA)  
Arquitetura e Design: 2026-07-30

---

## 📝 Próximas Ações

1. ✅ **Fase 0 Completa**: Análise de arquitetura finalizada
2. ⏳ **Aguardando Feedback**: Validar decisões pendentes (P001-P005 em DECISIONS.md)
3. 📅 **Fase 1**: Começar assim que feedback for recebido

---

Documentação detalhada em `docs/` → Comece em [ARCHITECTURE.md](docs/ARCHITECTURE.md)
