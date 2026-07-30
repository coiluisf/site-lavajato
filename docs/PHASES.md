# Plano de Desenvolvimento por Fases

**Status**: Fase 0 — Análise e Arquitetura Completa  
**Data**: 2026-07-30

---

## Fase 1: Fundação (Semanas 1-3)

**Objetivo**: Estrutura base, configurações, banco de dados, health check, tratamento de erros.

### Deliverables

#### 1.1 Monorepositório
- [ ] `pnpm-workspace.yaml`
- [ ] `tsconfig.json` (root)
- [ ] `package.json` (root workspace)
- [ ] Estrutura de diretórios completa
- [ ] `.gitignore` robusto
- [ ] `.env.example` (sem credenciais)

#### 1.2 Configuração Docker
- [ ] `docker-compose.yml` (dev)
- [ ] `Dockerfile` para API
- [ ] `Dockerfile` para Web
- [ ] `Dockerfile` para PostgreSQL
- [ ] Volumes persistentes
- [ ] Health checks

#### 1.3 Backend (NestJS)
- [ ] `app/api/package.json` com dependências core
- [ ] NestJS bootstrapping básico
- [ ] Prisma setup
- [ ] Database connection
- [ ] Health check endpoint (`GET /health`)
- [ ] Global error handler (HttpExceptionFilter)
- [ ] Request logging middleware
- [ ] CORS configurado
- [ ] Rate limiting básico
- [ ] Validação de entrada (Zod pipes)

#### 1.4 Frontend (Next.js)
- [ ] `apps/web/package.json` com dependências core
- [ ] Next.js 14 com App Router
- [ ] Tailwind CSS configurado
- [ ] shadcn/ui setup
- [ ] Layout base com navbar/sidebar
- [ ] Página de erro 404/500
- [ ] Página de health check inicial

#### 1.5 Banco de Dados
- [ ] PostgreSQL rodando em Docker
- [ ] Prisma schema inicial (13 tabelas principais)
- [ ] Primeira migration: `001_initial_schema`
- [ ] Seed data de teste (companies, roles, permissions)
- [ ] Indices e constraints

#### 1.6 Packages Compartilhados
- [ ] `packages/types/` — Tipos TypeScript principais
- [ ] `packages/validation/` — Schemas Zod base
- [ ] `packages/ui/` — Componentes shadcn/ui customizados

#### 1.7 Scripts de Desenvolvimento
- [ ] `scripts/setup.sh` — Setup inicial completo
- [ ] `scripts/dev.sh` — Inicia Docker Compose + watchers
- [ ] `scripts/build.sh` — Build de produção
- [ ] `scripts/test.sh` — Executa testes
- [ ] `scripts/migrate.sh` — Executar migrations

#### 1.8 Documentação Técnica
- [ ] `docs/SETUP.md` — Como configurar ambiente local
- [ ] `docs/API_GUIDE.md` — Padrões de API
- [ ] `docs/DATABASE.md` — Schema e relacionamentos
- [ ] `.github/CODE_STYLE.md` — Padrões de código

#### 1.9 Testes Iniciais
- [ ] Testes unitários básicos (Jest)
- [ ] Teste de health check API
- [ ] Teste de conexão com banco
- [ ] CI workflow básico (opcional na Fase 1)

#### 1.10 Validação
- [ ] `npm run lint` sem erros
- [ ] `npm run type-check` sem erros
- [ ] `npm run test` com cobertura > 70%
- [ ] Docker Compose sobe sem erros
- [ ] API responde em `localhost:3001/health`
- [ ] Frontend rodando em `localhost:3000`

### Critérios de Aceite

- ✅ Monorepositório pronto com todas as pastas
- ✅ Docker Compose sobe e executa todo o stack
- ✅ Database criado com schema Fase 1
- ✅ API NestJS rodando e respondendo
- ✅ Frontend Next.js rodando
- ✅ TypeScript strict em toda parte
- ✅ Linting aprovado (ESLint + Prettier)
- ✅ Testes básicos passando
- ✅ Documentação técnica completa
- ✅ Nenhum secret ou credencial no código
- ✅ .env.example pronto para usar

### Débitos Técnicos a Aceitar

- Rate limiting básico (não refinado)
- Logging simples (sem agregação)
- Tratamento de erro funcional (melhorar Fase 2+)
- Sem testes E2E ainda (Fase 4+)
- Sem CI/CD produção (Fase 8)

---

## Fase 2: Autenticação e Empresas (Semanas 4-6)

**Objetivo**: Autenticação segura, login, permissões, isolamento multi-tenant, primeiro acesso.

### Deliverables

#### 2.1 Módulo de Autenticação
- [ ] `auth/auth.module.ts`
- [ ] `auth/auth.service.ts`
- [ ] `auth/auth.controller.ts`
- [ ] Login endpoint (`POST /auth/login`)
- [ ] Logout endpoint (`POST /auth/logout`)
- [ ] Refresh token endpoint (`POST /auth/refresh`)
- [ ] Password reset request (`POST /auth/password-reset`)
- [ ] Password reset confirm (`POST /auth/password-reset/:token`)

#### 2.2 Guards e Decoradores
- [ ] `AuthGuard` — Valida JWT
- [ ] `AuthorizationGuard` — Verifica permissões
- [ ] `TenantGuard` — Valida companyId
- [ ] `@CurrentUser()` — Decorador customizado
- [ ] `@CheckPermission(...)` — Decorador de permissão
- [ ] `@GetTenantId()` — Extrai companyId

#### 2.3 Estratégia de Tokens
- [ ] Geração de access token (15 min)
- [ ] Geração de refresh token (7 dias, rotativo)
- [ ] Armazenamento de refresh com hash Argon2id
- [ ] Validação de refresh token na reutilização
- [ ] Revogação de sessão individual
- [ ] Revogação de todas as sessões do usuário

#### 2.4 Módulo de Empresas
- [ ] `companies/companies.module.ts`
- [ ] `companies/companies.service.ts`
- [ ] `companies/companies.controller.ts`
- [ ] Criação de empresa (admin)
- [ ] Leitura de dados da empresa
- [ ] Atualização de configurações básicas
- [ ] Listagem de empresas (admin)
- [ ] Ativação/Suspensão (admin)

#### 2.5 Módulo de Usuários
- [ ] `users/users.module.ts`
- [ ] `users/users.service.ts`
- [ ] `users/users.controller.ts`
- [ ] Criar usuário (admin)
- [ ] Listar usuários da empresa
- [ ] Atualizar próprio perfil
- [ ] Alterar senha própria
- [ ] Bloquear/desbloquear usuário (admin)
- [ ] Revogar sessões (admin)

#### 2.6 Módulo de Permissões
- [ ] `permissions/permissions.module.ts`
- [ ] `permissions/permissions.service.ts`
- [ ] Seed de permissões base (30-40 permissões)
- [ ] Associação de permissões a roles
- [ ] Verificação dinâmica de permissão

#### 2.7 Módulo de Plataforma (Admin)
- [ ] `platform-admins/platform-admins.module.ts`
- [ ] `platform-admins/platform-admins.service.ts`
- [ ] `platform-admins/platform-admins.controller.ts`
- [ ] Login de admin
- [ ] Criação de empresa (admin)
- [ ] Gerenciamento de usuários (admin)
- [ ] Acesso a logs

#### 2.8 Modo de Suporte
- [ ] `support/support.module.ts`
- [ ] Iniciar sessão de suporte
- [ ] Encerrar sessão de suporte
- [ ] Auditoria completa de suporte
- [ ] Marca visual de modo suporte no frontend

#### 2.9 Primeiro Acesso / Onboarding
- [ ] Validação de senha temporária
- [ ] Fluxo de criação de senha nova
- [ ] Redirecionamento para onboarding
- [ ] Página de onboarding (Fase 2 básica)

#### 2.10 Auditoria
- [ ] `audit/audit.module.ts`
- [ ] Logging de ações críticas
- [ ] Logging de alterações de dados
- [ ] Logging de tentativas de acesso
- [ ] Visualização de audit log (admin)

#### 2.11 Validação e DTOs
- [ ] `CreateUserDto`
- [ ] `LoginDto`
- [ ] `PasswordResetDto`
- [ ] `UpdateCompanySettingsDto`
- [ ] Schemas Zod equivalentes

#### 2.12 Testes de Segurança
- [ ] Teste de isolamento multi-tenant
- [ ] Teste de força bruta de login
- [ ] Teste de token inválido
- [ ] Teste de permissão negada
- [ ] Teste de refresh token rotativo
- [ ] Teste de companyId não confundível

#### 2.13 Frontend (Fase 2)
- [ ] Página de login `/auth/login`
- [ ] Página de reset de senha `/auth/password-reset`
- [ ] Página de confirmação de reset `/auth/reset/:token`
- [ ] Página de primeiro acesso `/onboarding/password`
- [ ] Layout protegido com autenticação
- [ ] Middleware de proteção de rotas
- [ ] Gerenciamento de contexto de usuário (Context API ou Zustand)
- [ ] Armazenamento seguro de tokens

### Critérios de Aceite

- ✅ Login funciona e retorna tokens válidos
- ✅ Refresh token é rotativo e validado
- ✅ Permissões são verificadas antes de cada ação
- ✅ Usuário de uma empresa não vê dados de outra
- ✅ Primeiro acesso força criação de nova senha
- ✅ Logout revoga todas as sessões
- ✅ Admin pode suspender empresa
- ✅ Modo de suporte audita todas as ações
- ✅ Testes de isolamento passam
- ✅ Senhas armazenadas com Argon2id
- ✅ Cookies HttpOnly, Secure, SameSite
- ✅ Rate limiting em login (máx 5 tentativas / 15 min)
- ✅ TypeScript strict sem `any`
- ✅ Sem logs de senha ou token
- ✅ Frontend protegido com guards

### Débitos Técnicos

- Recuperação de senha via SMS (implementar Fase 3+)
- Autenticação de dois fatores (implementar Fase 6+)
- SAML/OAuth (implementar Fase 7+ se necessário)

---

## Fase 3: Cadastros Operacionais (Semanas 7-8)

**Objetivo**: Estrutura de dados operacionais básicos.

### Deliverables

#### 3.1 Módulo de Clientes
- [ ] `customers/customers.module.ts`
- [ ] CRUD completo de clientes
- [ ] Listagem com filtros (nome, telefone, status)
- [ ] Soft delete de cliente
- [ ] Endereço denormalizado

#### 3.2 Módulo de Veículos
- [ ] `vehicles/vehicles.module.ts`
- [ ] CRUD completo de veículos
- [ ] Associação com cliente
- [ ] Categorização de veículo
- [ ] Placa normalizada e única por empresa
- [ ] Histórico de serviços do veículo

#### 3.3 Módulo de Categorias de Veículo
- [ ] CRUD de categorias
- [ ] Exemplo: Sedã, SUV, Caminhonete, etc.

#### 3.4 Módulo de Serviços
- [ ] `services/services.module.ts`
- [ ] CRUD de serviços
- [ ] Duração estimada
- [ ] Descrição

#### 3.5 Módulo de Preços
- [ ] `service-prices/service-prices.module.ts`
- [ ] Preços por serviço + categoria de veículo
- [ ] Histórico de preços (effective_from/until)
- [ ] Ativação/Desativação

#### 3.6 Módulo de Funcionários
- [ ] `employees/employees.module.ts`
- [ ] CRUD de funcionários
- [ ] Associação com usuário do sistema
- [ ] Percentual de comissão
- [ ] CPF normalizado e único por empresa
- [ ] Rôles: MANAGER, ATTENDANT, WASHER, OTHER

#### 3.7 Frontend (Fase 3)
- [ ] Dashboard básico (resumo empresa)
- [ ] Página de clientes
- [ ] Página de veículos
- [ ] Página de serviços
- [ ] Página de funcionários
- [ ] Modais/formulários de criação e edição

#### 3.8 Validações
- [ ] DTOs e Zod schemas para todas as entidades
- [ ] Validações de negócio (ex: placa única por empresa)

#### 3.9 Testes
- [ ] Testes unitários de service
- [ ] Testes de controller (autenticação + autorização)
- [ ] Testes de isolamento por empresa

### Critérios de Aceite

- ✅ CRUD de clientes, veículos, serviços funcionam
- ✅ Dados isolados por empresa
- ✅ Permissões verificadas
- ✅ Validações de entrada e negócio
- ✅ Preços associados corretamente
- ✅ Frontend responsivo
- ✅ Soft delete funciona
- ✅ Testes com cobertura > 80%

### Débitos Técnicos

- Importação de clientes em lote (Fase 5+)
- Integração com API de dados de veículos (Fase 6+)

---

## Fase 4: Operação (Semanas 9-12)

**Objetivo**: Agenda, ordens de serviço, fila, checklist, fotos.

### Deliverables

#### 4.1 Agendamento
- [ ] `appointments/appointments.module.ts`
- [ ] CRUD de agendamentos
- [ ] Calendário de disponibilidade
- [ ] Bloqueio de horários
- [ ] Notificações de confirmação (básico)

#### 4.2 Ordens de Serviço
- [ ] `service-orders/service-orders.module.ts`
- [ ] Criação de ordem baseada em agendamento
- [ ] Estados: DRAFT → WAITING → IN_PREPARATION → IN_SERVICE → QUALITY_CHECK → READY → DELIVERED
- [ ] Itens de serviço associados
- [ ] Cálculo de valor total
- [ ] Máquina de estados documentada

#### 4.3 Fila Operacional
- [ ] Visualização de fila do dia
- [ ] Sequência de atendimento
- [ ] Priorização manual
- [ ] Filtro por status

#### 4.4 Checklist de Entrada
- [ ] `inspections/inspections.module.ts`
- [ ] Modelo de checklist por categoria
- [ ] Fotografias de entrada
- [ ] Validação antes de iniciar serviço
- [ ] Registro de danos/observações

#### 4.5 Fotografias
- [ ] Upload de imagens
- [ ] Armazenamento (volume local ou S3)
- [ ] Thumbnails
- [ ] Organização por serviço
- [ ] Fotos antes/depois

#### 4.6 Transições de Status
- [ ] Máquina de estados implementada
- [ ] Validações de transição
- [ ] Bloqueio de transições inválidas
- [ ] Auditoria de transições

#### 4.7 Frontend (Fase 4)
- [ ] Calendário visual de agendamentos
- [ ] Página de nova ordem
- [ ] Fila em tempo real (polling)
- [ ] Checklist interativo
- [ ] Upload de fotos
- [ ] Status visual das ordens

#### 4.8 Testes
- [ ] Testes de máquina de estados
- [ ] Testes de transições válidas/inválidas
- [ ] Testes de upload
- [ ] Testes E2E de um fluxo completo

### Critérios de Aceite

- ✅ Ordem pode passar por todos os estados
- ✅ Transições inválidas são bloqueadas
- ✅ Checklist é preenchido antes de início
- ✅ Fotos armazenadas corretamente
- ✅ Fila visual funciona
- ✅ Frontend responsivo em mobile
- ✅ Botões operacionais grandes
- ✅ Auditoria completa
- ✅ Testes E2E com Playwright

### Débitos Técnicos

- Sincronização real-time (Fase 5+ com WebSockets)
- Notificações via WhatsApp (Fase 6+)
- Reconhecimento de placa (IA — Fase 7+)

---

## Fase 5: Financeiro (Semanas 13-14)

**Objetivo**: Pagamentos, caixa, movimentações, despesas.

### Deliverables

#### 5.1 Caixa Registradora
- [ ] `cash-registers/cash-registers.module.ts`
- [ ] Abertura de caixa
- [ ] Fechamento de caixa
- [ ] Movimentações (entrada/saída)
- [ ] Saldo atual
- [ ] Balancete

#### 5.2 Pagamentos
- [ ] `payments/payments.module.ts`
- [ ] Formas de pagamento (Dinheiro, Débito, Crédito, Pix, Boleto)
- [ ] Registro de pagamento na ordem
- [ ] Cancelamento de pagamento (com auditoria)
- [ ] Reembolso

#### 5.3 Movimentações
- [ ] Entradas (vendas)
- [ ] Saídas (despesas)
- [ ] Transferências
- [ ] Ajustes (com auditoria)

#### 5.4 Despesas
- [ ] `expenses/expenses.module.ts`
- [ ] Categorias de despesa
- [ ] Registro de despesa
- [ ] Comprovante (upload)
- [ ] Data de pagamento

#### 5.5 Auditoria Financeira
- [ ] Rastreamento de todas as transações
- [ ] Impossibilidade de deletar (apenas cancelar)
- [ ] Logs de alterações
- [ ] Reconciliação

#### 5.6 Frontend (Fase 5)
- [ ] Dashboard de caixa
- [ ] Página de pagamentos
- [ ] Página de despesas
- [ ] Relatório de movimentação
- [ ] Formulários de entrada

### Critérios de Aceite

- ✅ Caixa pode abrir/fechar
- ✅ Transações não podem ser deletadas
- ✅ Valores em Decimal (não float)
- ✅ Isolamento por empresa
- ✅ Auditoria completa
- ✅ Reconciliação funciona
- ✅ Acesso restrito por permissão

### Débitos Técnicos

- Integração com gateway de pagamento (Stripe, Square — Fase 8+)
- Nota fiscal automática (Fase 8+)

---

## Fase 6: Estoque e Comissões (Semanas 15-16)

**Objetivo**: Inventário, comissões, alertas.

### Deliverables

#### 6.1 Produtos
- [ ] `products/products.module.ts`
- [ ] CRUD de produtos
- [ ] Código único por empresa
- [ ] Descrição
- [ ] Preço de custo
- [ ] Preço de venda

#### 6.2 Movimentações de Estoque
- [ ] `stock-movements/stock-movements.module.ts`
- [ ] Entrada de produtos
- [ ] Saída de produtos (consumo em serviço)
- [ ] Ajuste de estoque
- [ ] Histórico completo
- [ ] Rastreamento de quantidade

#### 6.3 Consumo em Serviço
- [ ] Associação produto → ordem de serviço
- [ ] Quantidade consumida
- [ ] Preço aplicado
- [ ] Impacto no estoque automático

#### 6.4 Alertas de Estoque
- [ ] Nível mínimo
- [ ] Notificação quando atingir mínimo
- [ ] Relatório de estoque baixo

#### 6.5 Comissões
- [ ] `commissions/commissions.module.ts`
- [ ] Cálculo de comissão por serviço/funcionário
- [ ] Período de comissão
- [ ] Adiantamentos
- [ ] Fechamento de período
- [ ] Pagamento

#### 6.6 Frontend (Fase 6)
- [ ] Página de produtos
- [ ] Página de estoque
- [ ] Alertas visuais
- [ ] Relatório de comissões
- [ ] Página de pagamento de comissões

### Critérios de Aceite

- ✅ Estoque atualiza automaticamente
- ✅ Alerta funciona quando mínimo atingido
- ✅ Comissão calculada corretamente
- ✅ Dados isolados por empresa
- ✅ Histórico completo
- ✅ Testes de cálculo de comissão

### Débitos Técnicos

- Integração com fornecedores (Fase 8+)
- Previsão de demanda (IA — Fase 9+)

---

## Fase 7: Relatórios e Acabamento (Semanas 17-19)

**Objetivo**: Dashboards, relatórios, responsividade, acessibilidade, performance.

### Deliverables

#### 7.1 Dashboard Principal
- [ ] Resumo de hoje
- [ ] Ordens em progresso
- [ ] Movimentação financeira
- [ ] Avisos (estoque, vencimento, etc.)
- [ ] Gráficos principais

#### 7.2 Relatórios
- [ ] Relatório de serviços por período
- [ ] Relatório de faturamento
- [ ] Relatório de clientes mais ativos
- [ ] Relatório de funcionários (comissão)
- [ ] Exportação para PDF/Excel

#### 7.3 Responsividade
- [ ] Review de todas as páginas em mobile
- [ ] Touch-friendly buttons
- [ ] Layouts adaptativos

#### 7.4 Acessibilidade
- [ ] WCAG 2.1 AA (core)
- [ ] Navegação por teclado
- [ ] Contrast ratios adequados
- [ ] Alt text em imagens

#### 7.5 Performance
- [ ] Code splitting do Next.js
- [ ] Lazy loading de images
- [ ] Otimização de bundle
- [ ] Cache de requests

#### 7.6 Onboarding Completo
- [ ] Fluxo completo de primeiro acesso
- [ ] Etapas: Senha → Logo → Info → Serviços → Preços → Funcionários → Pagamentos → Pronto
- [ ] Progresso visual
- [ ] Resgatável

#### 7.7 Polimento
- [ ] Feedback visual em ações
- [ ] Confirmação de ações destrutivas
- [ ] Mensagens de erro claras
- [ ] Toast notifications
- [ ] Loading states

### Critérios de Aceite

- ✅ Todas as páginas responsivas
- ✅ Acessibilidade WCAG 2.1 AA
- ✅ Performance > 90 Lighthouse
- ✅ Onboarding completo e funcional
- ✅ Todos os relatórios funcionando
- ✅ Sem erros console
- ✅ UX polida

### Débitos Técnicos

- Analytics completa (Fase 8+)
- Predictive insights (IA — Fase 9+)

---

## Fase 8: Produção (Semanas 20-21)

**Objetivo**: Deploy, monitoramento, backups, documentação operacional.

### Deliverables

#### 8.1 Infraestrutura
- [ ] Docker Compose de produção
- [ ] Nginx com SSL/TLS
- [ ] PostgreSQL com backup automático
- [ ] Volume persistente
- [ ] Network Docker isolada

#### 8.2 HTTPS
- [ ] Certificado Let's Encrypt
- [ ] Renovação automática
- [ ] HSTS headers

#### 8.3 Backups
- [ ] Backup diário do banco
- [ ] Armazenamento fora da VPS
- [ ] Plano de recovery
- [ ] Testes de restore

#### 8.4 Monitoramento
- [ ] Health checks
- [ ] Alertas de erro
- [ ] Dashboard de logs
- [ ] Métricas básicas

#### 8.5 CI/CD
- [ ] GitHub Actions (build + test)
- [ ] Deploy automático
- [ ] Rollback strategy

#### 8.6 Documentação
- [ ] Deploy guide
- [ ] Operação (iniciar, parar, backups)
- [ ] Troubleshooting
- [ ] Escalação

### Critérios de Aceite

- ✅ Aplicação roda em VPS
- ✅ HTTPS funciona
- ✅ Backups automáticos
- ✅ Downtime planejado < 5 min
- ✅ RTO/RPO definidos
- ✅ Documentação completa

---

## Fase 9+: Futuro (Fora do MVP)

- Integração com gateway de pagamento (Stripe)
- Emissão de nota fiscal (NFe)
- Integração com WhatsApp Business
- Aplicativo nativo (React Native)
- Reconhecimento de placas (IA)
- Programa de fidelidade avançado
- Integração contábil
- Analytics avançada
- Machine learning para previsão
- Multi-idioma
- Histórico completo de preços

---

## Cronograma Visual

```
Fase 1 (Fundação)     |████████████|  3 sem
Fase 2 (Auth)         |████████████████████|  3 sem
Fase 3 (Cadastros)    |██████████████|  2 sem
Fase 4 (Operação)     |██████████████████████|  4 sem
Fase 5 (Financeiro)   |███████████|  2 sem
Fase 6 (Estoque)      |███████████|  2 sem
Fase 7 (Relatórios)   |██████████████|  2.5 sem
Fase 8 (Produção)     |█████████|  1.5 sem
────────────────────────────────────────────
Total                                 20 sem (~5 meses)
```

---

## Regras Globais de Desenvolvimento

1. **Ao final de cada fase**:
   - Executar `npm run lint` sem erros
   - Executar `npm run type-check` sem erros
   - Executar `npm run test` com cobertura > 70%
   - Documentar decisões e débitos técnicos
   - Aguardar aprovação antes de avançar

2. **Código**:
   - TypeScript strict
   - Sem `any`
   - Nomes claros
   - Funções pequenas
   - Responsabilidades separadas

3. **Segurança**:
   - Nenhum secret no repo
   - Logs sem dados sensíveis
   - Validação de entrada
   - Testes de autorização

4. **Qualidade**:
   - Revisar código
   - Testes antes de feature
   - Sem TODOs escondendo críticos
   - Não simular funcionalidades prontas

5. **Git**:
   - Commits claros
   - Sem rebase destrutivo
   - Preservar histórico
   - Branch development sempre

---

Fim do documento de fases.
