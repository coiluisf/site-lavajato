# Arquitetura do Sistema de Gestão de Lava-Jatos
## site-lavajato

**Status**: Fase 0 — Planejamento e Arquitetura  
**Data**: 2026-07-30  
**Versão**: 1.0

---

## 1. Resumo Executivo

Este documento apresenta a arquitetura recomendada para o **site-lavajato**, um sistema web profissional de gestão para lava-jatos. O sistema será:

- **Multi-tenant**: Múltiplos lava-jatos usando a mesma aplicação
- **Isolado logicamente**: Dados de cada empresa completamente separados
- **Monolítico modular**: Uma base de código única, não microsserviços
- **Seguro**: Autenticação e autorização robustas
- **Escalável**: Arquitetura preparada para crescimento
- **Desenvolvido incrementalmente**: Fases bem definidas com critérios de aceite

### Stack Tecnológico Recomendado

**Frontend**: Next.js 14+ (App Router) + React + TypeScript + Tailwind + shadcn/ui  
**Backend**: NestJS + TypeScript + PostgreSQL + Prisma  
**Infraestrutura**: Docker + Docker Compose + Nginx + VPS Hostinger  
**Monorepo**: pnpm workspaces  

---

## 2. Estado Atual do Repositório

- **Repositório**: Vazio, sem commits
- **Branch atual**: `claude/car-wash-management-architecture-ond4qy`
- **Git**: Inicializado, pronto para primeira commit
- **Estrutura**: A criar

---

## 3. Decisão de Compatibilidade

A especificação fornecida é **altamente compatível** com a stack recomendada:

✅ **Totalmente alinhado**:
- Multi-tenant com isolamento rigoroso
- Autenticação baseada em sessão segura
- Autorização baseada em perfis e permissões
- Modo de suporte auditado
- Modelo de dados com companyId em todas as entidades
- Segurança em primeiro lugar

⚠️ **Pontos a validar** (não conflitos, apenas clarificações):
1. **Redis**: Não será incluído na Fase 1. Se necessário futuramente para cache ou sessões distribuídas, será adicionado.
2. **Arquivo**: Qual estratégia preferir para fotos? S3/Object Storage ou volume persistente local?
3. **Fiscal**: Integração com emissão de nota fiscal será posterior ao MVP.

---

## 4. Estrutura do Monorepositório

```
site-lavajato/
├── apps/
│   ├── web/                          # Frontend Next.js
│   │   ├── src/
│   │   │   ├── app/                  # App Router do Next.js
│   │   │   ├── components/           # Componentes React reutilizáveis
│   │   │   ├── modules/              # Módulos organizados por domínio
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── utils/                # Utilitários
│   │   │   └── types/                # Tipos específicos do frontend
│   │   ├── public/                   # Arquivos estáticos
│   │   ├── .eslintrc.json
│   │   ├── next.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                          # Backend NestJS
│       ├── src/
│       │   ├── main.ts               # Ponto de entrada
│       │   ├── common/               # Módulos compartilhados
│       │   │   ├── guards/           # Guards (autenticação, autorização)
│       │   │   ├── interceptors/     # Interceptors (transformação, logging)
│       │   │   ├── filters/          # Filters (tratamento de erros)
│       │   │   ├── pipes/            # Pipes (validação)
│       │   │   ├── decorators/       # Decorators customizados
│       │   │   └── utils/            # Utilitários
│       │   │
│       │   ├── modules/              # Módulos de negócio
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── companies/
│       │   │   ├── platform-admins/
│       │   │   ├── permissions/
│       │   │   ├── support/
│       │   │   ├── audit/
│       │   │   ├── customers/
│       │   │   ├── vehicles/
│       │   │   ├── services/
│       │   │   ├── employees/
│       │   │   ├── appointments/
│       │   │   ├── service-orders/
│       │   │   ├── inspections/
│       │   │   ├── inventory/
│       │   │   ├── cash-registers/
│       │   │   ├── payments/
│       │   │   ├── expenses/
│       │   │   ├── commissions/
│       │   │   ├── reports/
│       │   │   ├── settings/
│       │   │   └── health/
│       │   │
│       │   └── config/               # Configurações
│       │       ├── database.config.ts
│       │       ├── auth.config.ts
│       │       └── app.config.ts
│       │
│       ├── migrations/               # Prisma migrations
│       ├── prisma/
│       │   └── schema.prisma         # Schema do banco
│       ├── .env.example
│       ├── .eslintrc.json
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── types/                        # Tipos TypeScript compartilhados
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── domain/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── validation/                   # Schemas Zod compartilhados
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── companies/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ui/                           # Componentes shadcn/ui customizados
│       ├── src/
│       │   ├── components/
│       │   └── index.ts
│       └── package.json
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.web
│   │   ├── Dockerfile.api
│   │   └── Dockerfile.postgres
│   │
│   ├── docker-compose.yml            # Dev environment
│   ├── docker-compose.prod.yml       # Production (Fase 8)
│   │
│   ├── nginx/
│   │   ├── nginx.conf
│   │   ├── conf.d/
│   │   │   ├── api.conf
│   │   │   └── web.conf
│   │   └── ssl/                      # Certificados HTTPS (Fase 8)
│   │
│   └── scripts/
│       ├── setup.sh                  # Setup inicial
│       ├── migrate.sh                # Executar migrations
│       └── backup.sh                 # Backup do banco (Fase 8)
│
├── docs/
│   ├── ARCHITECTURE.md               # Este arquivo
│   ├── SECURITY.md                   # Estratégia de segurança
│   ├── DATA_MODEL.md                 # Modelo de dados
│   ├── AUTHENTICATION.md             # Fluxo de autenticação
│   ├── MULTI_TENANCY.md              # Isolamento multi-tenant
│   ├── API_GUIDE.md                  # Guia de desenvolvimento da API
│   ├── PHASES.md                     # Divisão de fases
│   ├── DECISIONS.md                  # Log de decisões arquiteturais
│   ├── SETUP.md                      # Instruções de setup local
│   └── database/
│       └── schema-v1.md              # Documentação do schema
│
├── scripts/
│   ├── setup.sh
│   ├── dev.sh
│   ├── build.sh
│   └── test.sh
│
├── .env.example
├── .gitignore
├── .editorconfig
├── pnpm-workspace.yaml
├── turbo.json                        # Se usar Turborepo
├── tsconfig.json                     # Configuração TypeScript root
├── prettier.config.js
├── .eslintrc.json
├── package.json                      # Root workspace
└── README.md
```

---

## 5. Princípios Arquiteturais

### 5.1 Isolamento Multi-Tenant

**Regra de Ouro**: Nenhuma query sem `companyId` validado do usuário autenticado.

- Todo modelo de dados operacional leva `companyId`
- Contexto de tenant injetado por requisição via middleware/guard
- Permissões verificadas antes de consultar dados
- Testes automáticos de isolamento entre empresas

### 5.2 Segurança em Camadas

1. **Transport**: HTTPS obrigatório
2. **Autenticação**: JWT (access) + Refresh (rotativo)
3. **Sessão**: Validada no banco com hash
4. **Autorização**: Guards + Decorators + Interceptors
5. **Dados**: Validação de entrada (Zod), sanitização conforme necessário
6. **Auditoria**: Log de ações críticas

### 5.3 Modularidade

- Módulos NestJS por domínio de negócio
- Cada módulo com seu controller, service, repository, DTOs
- Módulo `common` para comportamentos compartilhados
- Sem dependências cíclicas
- Serviços podem ser testados independentemente

### 5.4 Sem Abstrações Prematuras

- Começar simples
- Adicionar padrões quando 3+ entidades precisarem
- Documentar exceções deliberadas
- Revisar antes de escalar

---

## 6. Estratégia de Autenticação

### 6.1 Fluxo Geral

```
[Login com email/senha]
         ↓
[Validar credenciais contra usuário]
         ↓
[Verificar situação do usuário]
         ↓
[Verificar situação da empresa]
         ↓
[Gerar tokens (access + refresh)]
         ↓
[Armazenar refresh com hash em banco]
         ↓
[Retornar access token + refresh em cookie seguro]
         ↓
[Cliente usa access token para requisições]
         ↓
[Refresh token rotativo quando próximo do vencimento]
```

### 6.2 Tokens

**Access Token**
- Duração: 15 minutos
- Transportado em cookie HttpOnly OU header Authorization
- Contém: userId, companyId, role
- Validado em cada requisição

**Refresh Token**
- Duração: 7 dias
- Rotativo: Um novo é gerado a cada uso
- Armazenado em banco com hash (Argon2id)
- Cookie HttpOnly, Secure, SameSite=Strict
- Invalidado ao logout ou quando renovado

### 6.3 Senhas

- Hash com Argon2id
- Nunca recuperáveis (apenas reset)
- Validação de complexidade mínima obrigatória
- Histórico (não repetir últimas 3) — implementar na Fase 2
- Obrigatoriedade de troca no primeiro acesso

### 6.4 Sessões

- Tabela `UserSession` com: userId, companyId, refreshTokenHash, expiresAt, issuedAt, userAgent, ipAddress, revokedAt
- Validação em cada uso do refresh token
- Possibilidade de revogar todas as sessões do usuário
- Limpeza automática de sessões expiradas

### 6.5 Recuperação de Senha

- Token temporário (20 caracteres, aleatório)
- Armazenado com hash em `PasswordResetToken`
- Válido por 1 hora
- Marcar como usado após uso
- Novo reset invalida anteriores

### 6.6 Primeira Acesso

- Senha temporária gerada pelo admin
- Expirada na primeira tentativa de login
- Usuário obrigado a criar nova senha
- Não permitir uso de senha temporária após criação

---

## 7. Estratégia de Autorização

### 7.1 Papéis (Roles)

Inicialmente 5 papéis para clientes:

- **OWNER**: Acesso total aos dados próprios
- **MANAGER**: Gestão operacional com restrições
- **ATTENDANT**: Atendimento e agendamento
- **WASHER**: Operação da limpeza
- **FINANCE**: Gestão financeira

Papéis administrativos (plataforma):

- **SUPER_ADMIN**: Acesso total à plataforma
- **SUPPORT**: Suporte com modo auditado

### 7.2 Permissões

Sistema extensível de permissões:

```
Exemplo de permissões:
- companies:list
- companies:read
- companies:update
- companies:suspend
- users:list
- users:read
- users:create
- users:update
- users:delete
- service-orders:list
- service-orders:read
- service-orders:create
- service-orders:update
- service-orders:cancel
- payments:list
- payments:create
- payments:refund
```

Armazenar no banco: tabela `Permission` + tabela `RolePermission` (relação many-to-many)

### 7.3 Guards de Autorização

```typescript
// Exemplo de decorador
@UseGuards(AuthGuard, AuthorizationGuard)
@CheckPermission('service-orders:create')
@Post('/service-orders')
async createServiceOrder(@Body() dto: CreateServiceOrderDto, @User() user: CurrentUser)
```

### 7.4 Validação Centralizada

- `AuthGuard`: Verifica autenticação (access token válido)
- `AuthorizationGuard`: Verifica permissões baseado em decorador
- `TenantGuard`: Valida companyId extraído da sessão
- Middleware de erro centralizado

---

## 8. Estratégia Multi-Tenant (Isolamento)

### 8.1 Modelo de Isolamento: Row-Level Tenant

Cada tabela de negócio leva coluna `companyId`.

```sql
CREATE TABLE service_orders (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id),
  order_number INTEGER NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  created_at TIMESTAMP NOT NULL,
  ...
  CONSTRAINT unique_company_order UNIQUE(company_id, order_number)
);

CREATE INDEX idx_service_orders_company_id ON service_orders(company_id);
CREATE INDEX idx_service_orders_company_order ON service_orders(company_id, order_number);
```

### 8.2 Validação em Múltiplas Camadas

**Camada 1: Guard/Middleware**
```typescript
// Extrai companyId do contexto autenticado
const companyId = req.user.companyId; // Nunca do query param
```

**Camada 2: Service**
```typescript
async getServiceOrder(orderId: string, companyId: string) {
  return this.prisma.serviceOrder.findUnique({
    where: {
      id: orderId,
      companyId, // Validação explícita
    },
  });
}
```

**Camada 3: Database (Opcional - Fase 2)**
PostgreSQL Row-Level Security (RLS) como defesa adicional:
```sql
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY company_isolation ON service_orders
  FOR ALL USING (company_id = current_setting('app.current_company_id')::uuid);
```

### 8.3 Dados Isolados

Completamente separados entre empresas:
- Clientes
- Veículos
- Serviços
- Preços
- Funcionários
- Agendamentos
- Ordens
- Pagamentos
- Estoque
- Configurações

### 8.4 Dados Compartilhados (Apenas Plataforma)

Não isolados por empresa:
- Companies (catálogo de empresas)
- Users (credenciais)
- PlatformAdmins
- Roles (templates de papéis)
- Permissions (templates de permissões)
- AuditLog (log centralizado)

---

## 9. Estratégia de Modo de Suporte Auditado

### 9.1 Fluxo

1. Administrador acessa painel administrativo
2. Seleciona empresa
3. Clica "Iniciar Modo de Suporte"
4. Informa motivo obrigatoriamente
5. Sistema cria registro `SupportSession`
6. Admin passa a visualizar dados da empresa
7. Faixa permanente: "🔴 MODO DE SUPORTE - [Motivo]"
8. Admin realiza ações
9. Clica "Encerrar Modo"
10. Sistema registra encerramento

### 9.2 Contexto de Suporte

```typescript
interface SupportContext {
  supportAdminId: string;      // Admin que iniciou
  companyId: string;           // Empresa sendo atendida
  supportSessionId: string;    // ID da sessão
  mode: 'ADMIN' | 'SUPPORT';   // Tipo de contexto
  impersonatingUserId?: string; // Se representando alguém
}
```

### 9.3 Tabela SupportSession

```
support_sessions:
  id UUID
  platform_admin_id UUID (quem iniciou)
  company_id UUID
  reason TEXT (obrigatório)
  started_at TIMESTAMP
  ended_at TIMESTAMP?
  user_agent TEXT
  ip_address INET
  actions_count INTEGER
  status ENUM('ACTIVE', 'CLOSED')
```

### 9.4 Auditoria de Suporte

Cada ação em modo de suporte é registrada com:
- supportSessionId
- platformAdminId (origem real)
- companyId
- timestamp
- mudanças realizadas

Admin não pode "fingir" ser o proprietário. Identidade é sempre preservada.

---

## 10. Estratégia de Gestão de Situações

### 10.1 Empresa (CompanyStatus)

| Status | Descrição | Acesso | Novo Login |
|--------|-----------|--------|-----------|
| PENDING_SETUP | Cadastrada, setup incompleto | Limitado ao onboarding | Redirecionado para onboarding |
| ACTIVE | Operacional normal | Completo | Normal |
| OVERDUE | Licença vencida (período de tolerância) | Acesso com aviso | Alerta de vencimento |
| SUSPENDED | Suspensão (falta de pagamento ou violação) | Bloqueado | Acesso negado com motivo |
| CANCELLED | Cancelada | Bloqueado | Acesso negado |

### 10.2 Usuário (UserStatus)

| Status | Descrição |
|--------|-----------|
| PENDING_FIRST_LOGIN | Aguardando primeiro acesso |
| ACTIVE | Operacional |
| TEMPORARILY_BLOCKED | Bloqueado por tentativas falhas |
| DISABLED | Desabilitado pelo admin |
| DELETED | Soft deleted |

### 10.3 Validações na Autenticação

```typescript
// Ao fazer login:
1. Validar credenciais do usuário
2. Validar userStatus !== 'DISABLED'
3. Validar companyStatus === 'ACTIVE' ou 'PENDING_SETUP'
4. Se 'PENDING_SETUP', redirecionar para onboarding
5. Se 'OVERDUE', permitir acesso com aviso
6. Se 'SUSPENDED' ou 'CANCELLED', recusar
7. Verificar limite de tentativas falhas (rate limiting)
```

---

## 11. Modelo de Dados Inicial

### 11.1 Entidades da Primeira Migration

**Categoria A: Plataforma (Sem isolamento)**

```
1. companies
   - id (UUID)
   - name (STRING)
   - legal_name (STRING)
   - display_name (STRING)
   - cnpj_cpf (STRING, normalizado)
   - logo_url (STRING?)
   - phone (STRING, normalizado)
   - whatsapp (STRING, normalizado)
   - email (STRING)
   - address (TEXT?)
   - business_hours (JSON?)
   - status (ENUM: PENDING_SETUP, ACTIVE, OVERDUE, SUSPENDED, CANCELLED)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. users
   - id (UUID)
   - company_id (UUID, FK companies)
   - email (STRING, unique per company)
   - password_hash (STRING)
   - name (STRING)
   - phone (STRING, normalizado)
   - profile (ENUM: OWNER, MANAGER, ATTENDANT, WASHER, FINANCE)
   - status (ENUM: PENDING_FIRST_LOGIN, ACTIVE, TEMPORARILY_BLOCKED, DISABLED, DELETED)
   - last_login_at (TIMESTAMP?)
   - last_login_ip (INET?)
   - is_first_login (BOOLEAN)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)
   - created_by (UUID?)
   - updated_by (UUID?)

3. user_sessions
   - id (UUID)
   - user_id (UUID, FK users)
   - company_id (UUID, FK companies)
   - refresh_token_hash (STRING)
   - expires_at (TIMESTAMP)
   - issued_at (TIMESTAMP)
   - revoked_at (TIMESTAMP?)
   - user_agent (TEXT)
   - ip_address (INET)
   - status (ENUM: ACTIVE, REVOKED, EXPIRED)

4. password_reset_tokens
   - id (UUID)
   - user_id (UUID, FK users)
   - token_hash (STRING)
   - expires_at (TIMESTAMP)
   - used_at (TIMESTAMP?)
   - created_at (TIMESTAMP)

5. platform_admins
   - id (UUID)
   - email (STRING, unique)
   - password_hash (STRING)
   - name (STRING)
   - role (ENUM: SUPER_ADMIN, SUPPORT)
   - status (ENUM: ACTIVE, DISABLED)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

6. platform_admin_sessions
   - id (UUID)
   - platform_admin_id (UUID, FK platform_admins)
   - refresh_token_hash (STRING)
   - expires_at (TIMESTAMP)
   - issued_at (TIMESTAMP)
   - revoked_at (TIMESTAMP?)
   - user_agent (TEXT)
   - ip_address (INET)
   - status (ENUM: ACTIVE, REVOKED, EXPIRED)

7. support_sessions
   - id (UUID)
   - platform_admin_id (UUID, FK platform_admins)
   - company_id (UUID, FK companies)
   - reason (TEXT, NOT NULL)
   - started_at (TIMESTAMP)
   - ended_at (TIMESTAMP?)
   - started_ip (INET)
   - started_user_agent (TEXT)
   - ended_ip (INET?)
   - actions_count (INTEGER, default 0)
   - status (ENUM: ACTIVE, CLOSED)
   - notes (TEXT?)

8. company_licenses
   - id (UUID)
   - company_id (UUID, FK companies, unique)
   - license_type (ENUM: TRIAL, MONTHLY, ANNUAL, PERPETUAL)
   - expires_at (TIMESTAMP)
   - issued_at (TIMESTAMP)
   - is_active (BOOLEAN)
   - notes (TEXT?)

9. audit_logs
   - id (UUID)
   - user_id (UUID, FK users, nullable)
   - platform_admin_id (UUID, FK platform_admins, nullable)
   - support_session_id (UUID, FK support_sessions, nullable)
   - company_id (UUID, FK companies, nullable)
   - action (STRING)
   - entity_type (STRING)
   - entity_id (UUID)
   - changes (JSONB)
   - ip_address (INET)
   - user_agent (TEXT)
   - timestamp (TIMESTAMP)
   - status (ENUM: SUCCESS, FAILURE)
   - error_message (TEXT?)
```

**Categoria B: Negócio (Isolados por empresa)**

```
10. company_settings
    - id (UUID)
    - company_id (UUID, FK companies, unique)
    - business_name (STRING)
    - legal_name (STRING)
    - cnpj_cpf (STRING, normalizado)
    - phone (STRING, normalizado)
    - whatsapp (STRING, normalizado)
    - email (STRING)
    - address (TEXT)
    - city (STRING)
    - state (STRING)
    - postal_code (STRING)
    - business_hours (JSONB)
    - note_header (TEXT?)
    - note_footer (TEXT?)
    - receipt_footer (TEXT?)
    - default_currency (STRING, default 'BRL')
    - timezone (STRING, default 'America/Sao_Paulo')
    - language (STRING, default 'pt-BR')
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)

11. customers
    - id (UUID)
    - company_id (UUID, FK companies)
    - name (STRING)
    - email (STRING?)
    - phone (STRING, normalizado)
    - whatsapp (STRING, normalizado?)
    - cpf (STRING, normalizado, nullable)
    - address (TEXT?)
    - city (STRING?)
    - state (STRING?)
    - notes (TEXT?)
    - status (ENUM: ACTIVE, INACTIVE)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)
    - UNIQUE(company_id, phone)

12. vehicles
    - id (UUID)
    - company_id (UUID, FK companies)
    - customer_id (UUID, FK customers)
    - plate (STRING, normalizado)
    - make (STRING)
    - model (STRING)
    - color (STRING?)
    - year (INTEGER?)
    - category_id (UUID, FK vehicle_categories)
    - notes (TEXT?)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)
    - UNIQUE(company_id, plate)

13. vehicle_categories
    - id (UUID)
    - company_id (UUID, FK companies)
    - name (STRING)
    - description (TEXT?)
    - sort_order (INTEGER)
    - is_active (BOOLEAN)
    - created_at (TIMESTAMP)
    - UNIQUE(company_id, name)

14. services
    - id (UUID)
    - company_id (UUID, FK companies)
    - name (STRING)
    - description (TEXT?)
    - duration_minutes (INTEGER)
    - is_active (BOOLEAN)
    - sort_order (INTEGER)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)
    - UNIQUE(company_id, name)

15. service_prices
    - id (UUID)
    - company_id (UUID, FK companies)
    - service_id (UUID, FK services)
    - vehicle_category_id (UUID, FK vehicle_categories)
    - price (DECIMAL(10, 2))
    - is_active (BOOLEAN)
    - effective_from (TIMESTAMP)
    - effective_until (TIMESTAMP?)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)
    - UNIQUE(company_id, service_id, vehicle_category_id)

16. employees
    - id (UUID)
    - company_id (UUID, FK companies)
    - name (STRING)
    - cpf (STRING, normalizado)
    - phone (STRING, normalizado)
    - email (STRING?)
    - role (ENUM: MANAGER, ATTENDANT, WASHER, OTHER)
    - commission_percentage (DECIMAL(5, 2)?)
    - salary (DECIMAL(10, 2)?)
    - status (ENUM: ACTIVE, INACTIVE)
    - user_id (UUID?, FK users, unique within company)
    - hired_at (DATE)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)
    - UNIQUE(company_id, cpf)
```

### 11.2 Entidades Inicialmente NÃO Incluídas

Estas serão criadas nas fases subsequentes:

- `appointments` (Fase 4 — Agenda)
- `service_orders` (Fase 4 — Operação)
- `service_order_items` (Fase 4)
- `inspections` (Fase 4)
- `attachments` (Fase 4)
- `products` (Fase 6 — Estoque)
- `stock_movements` (Fase 6)
- `cash_registers` (Fase 5 — Financeiro)
- `cash_movements` (Fase 5)
- `payments` (Fase 5)
- `expenses` (Fase 5)
- `commissions` (Fase 6)
- Tudo referente a relatórios (Fase 7)

---

## 12. Índices e Constraints Iniciais

```sql
-- Companies
CREATE INDEX idx_companies_status ON companies(status);
CREATE UNIQUE INDEX idx_companies_cnpj_cpf ON companies(cnpj_cpf);

-- Users
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_status ON users(status);
CREATE UNIQUE INDEX idx_users_email_company ON users(email, company_id);

-- User Sessions
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_company_id ON user_sessions(company_id);

-- Platform Admins
CREATE UNIQUE INDEX idx_platform_admins_email ON platform_admins(email);

-- Support Sessions
CREATE INDEX idx_support_sessions_company_id ON support_sessions(company_id);
CREATE INDEX idx_support_sessions_admin_id ON support_sessions(platform_admin_id);
CREATE INDEX idx_support_sessions_status ON support_sessions(status);

-- Audit Logs
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Customers
CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE UNIQUE INDEX idx_customers_phone_company ON customers(phone, company_id);

-- Vehicles
CREATE INDEX idx_vehicles_company_id ON vehicles(company_id);
CREATE INDEX idx_vehicles_customer_id ON vehicles(customer_id);
CREATE UNIQUE INDEX idx_vehicles_plate_company ON vehicles(plate, company_id);
CREATE INDEX idx_vehicles_category_id ON vehicles(category_id);

-- Vehicle Categories
CREATE INDEX idx_vehicle_categories_company_id ON vehicle_categories(company_id);

-- Services
CREATE INDEX idx_services_company_id ON services(company_id);

-- Service Prices
CREATE INDEX idx_service_prices_company_id ON service_prices(company_id);
CREATE INDEX idx_service_prices_service_id ON service_prices(service_id);
CREATE INDEX idx_service_prices_category_id ON service_prices(vehicle_category_id);

-- Employees
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_user_id ON employees(user_id);
CREATE UNIQUE INDEX idx_employees_cpf_company ON employees(cpf, company_id);
```

---

## 13. Diagramas de Fluxo

### 13.1 Fluxo de Login

```
┌─────────────────────────────────────────────────────┐
│ Usuário acessa app.seudominio.com.br                │
└──────────────────┬──────────────────────────────────┘
                   ↓
        ┌──────────────────────┐
        │ Página de login      │
        │ email + senha        │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────────────────────────┐
        │ POST /auth/login                         │
        │ { email, password }                      │
        └──────────┬───────────────────────────────┘
                   ↓
        ┌──────────────────────────────────────────┐
        │ 1. Buscar usuário por email              │
        │ 2. Verificar senha com Argon2id          │
        │ 3. Validar userStatus                    │
        │ 4. Validar companyStatus                 │
        │ 5. Gerar access token (15 min)           │
        │ 6. Gerar refresh token                   │
        │ 7. Armazenar refresh com hash + sessão   │
        └──────────┬───────────────────────────────┘
                   ↓
        ┌──────────────────────────────────────────┐
        │ Retornar:                                │
        │ - access_token (cookie)                  │
        │ - refresh_token (cookie HttpOnly)        │
        │ - user info (userId, companyId, role)    │
        └──────────┬───────────────────────────────┘
                   ↓
        ┌──────────────────────────────────────────┐
        │ Frontend valida:                         │
        │ - Token presente e válido?               │
        │ - Empresa ativa?                         │
        │ - Precisar fazer onboarding?             │
        └──────────┬───────────────────────────────┘
                   ↓
        ┌──────────────────────────────────────────┐
        │ Se PENDING_SETUP → Onboarding            │
        │ Se ACTIVE → Dashboard                    │
        │ Se OVERDUE → Dashboard + Aviso           │
        └──────────────────────────────────────────┘
```

### 13.2 Fluxo de Autorização

```
┌─────────────────────────────────────┐
│ GET /service-orders                 │
│ Headers: Authorization: Bearer JWT  │
└──────────────┬──────────────────────┘
               ↓
       ┌───────────────────┐
       │ AuthGuard         │
       │ Validar JWT       │
       └───────┬───────────┘
               ↓
       ┌───────────────────┐
       │ Extrair:          │
       │ - userId          │
       │ - companyId       │
       │ - role            │
       └───────┬───────────┘
               ↓
       ┌───────────────────────────────┐
       │ AuthorizationGuard            │
       │ @CheckPermission('...:read')  │
       │ Validar permissão             │
       └───────┬───────────────────────┘
               ↓
       ┌───────────────────────────────┐
       │ TenantGuard                   │
       │ Validar companyId do contexto │
       └───────┬───────────────────────┘
               ↓
       ┌───────────────────────────────┐
       │ Service executa query:        │
       │ WHERE company_id = $companyId │
       │ (companyId extraído do user)  │
       └───────┬───────────────────────┘
               ↓
       ┌───────────────────────────────┐
       │ Retornar dados isolados       │
       └───────────────────────────────┘
```

---

## 14. Segurança: Checklist

- ✅ HTTPS obrigatório (Nginx + certificado)
- ✅ Autenticação: JWT com refresh rotativo
- ✅ Senhas: Argon2id com salt
- ✅ Cookies: HttpOnly, Secure, SameSite
- ✅ Rate limiting: Tentativas de login
- ✅ CSRF: Token em requisições mutantes se necessário
- ✅ Validação: Zod em todas as entradas
- ✅ Isolamento: companyId em cada query
- ✅ Auditoria: Log de ações críticas
- ✅ Permissões: Guards + Decorators
- ✅ Secrets: .env.example sem credenciais
- ✅ Logs: Sem senhas, tokens ou dados excessivos
- ✅ Dependências: Mantidas atualizadas

---

## 15. Próximas Fases (Resumo)

| Fase | Foco | Duração Est. |
|------|------|-------------|
| 0 (Atual) | Arquitetura e Planejamento | Completo |
| 1 | Fundação (Monorepositório, Docker, DB) | 2-3 semanas |
| 2 | Autenticação, Empresas, Usuários | 2-3 semanas |
| 3 | Cadastros (Clientes, Veículos, Serviços) | 2 semanas |
| 4 | Operação (Agenda, Ordens, Fila) | 3-4 semanas |
| 5 | Financeiro (Caixa, Pagamentos) | 2 semanas |
| 6 | Estoque e Comissões | 2 semanas |
| 7 | Relatórios e Acabamento | 2-3 semanas |
| 8 | Produção (Deploy, Monitoramento) | 1-2 semanas |

**Total estimado**: 16-21 semanas (4-5 meses)

---

## 16. Decisões Já Tomadas

1. **Stack**: Next.js + NestJS + PostgreSQL + Prisma ✓
2. **Autenticação**: JWT com refresh rotativo ✓
3. **Isolamento**: Row-level com companyId validado ✓
4. **Papéis**: 5 tipos inicialmente ✓
5. **Permissões**: Sistema extensível com guards ✓
6. **Modo suporte**: Auditado, sem impersonação silenciosa ✓
7. **Monorepositório**: pnpm workspaces ✓
8. **Sem Redis**: Inicialmente não necessário ✓
9. **Sem microsserviços**: Monólito modular ✓
10. **Primeiro MVP**: 16 componentes principais ✓

---

## 17. Decisões Pendentes (Aguardando Feedback)

1. **Armazenamento de fotos**: S3/Object Storage ou volume local?
2. **Emissor de nota fiscal**: Qual integração (RFB, Nuvem Fiscal, manual)?
3. **Fuso horário**: Hardcoded America/Sao_Paulo ou configurável por empresa?
4. **Soft delete**: Aplicar sempre ou apenas em financeiro/auditoria?
5. **PostgreSQL RLS**: Implementar como defesa ou apenas em camada aplicação?

---

## 18. Riscos Identificados

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Vazamento de dados entre empresas | CRÍTICA | Testes automáticos de isolamento + RLS no DB |
| Ataque de força bruta | ALTA | Rate limiting + bloqueio temporário |
| Expo​sição de secretos | CRÍTICA | .env local, nenhum secret no repo |
| Corrupção de dados | ALTA | Transações, constraints, backups |
| Performance sob carga | MÉDIA | Índices, caching (Redis Fase 2+) |
| Escalabilidade | MÉDIA | Arquitetura modular preparada |

---

Fim do documento de arquitetura.

**Próximo documento**: `docs/DATA_MODEL.md` (detalhamento de schema e relacionamentos)
