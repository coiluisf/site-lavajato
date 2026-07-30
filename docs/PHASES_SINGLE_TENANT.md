# Plano de Desenvolvimento — Single-Tenant

**Status**: Fase 0 — Planejamento Revisado  
**Data**: 2026-07-30  
**Modelo**: 1 instância = 1 lava-jato

---

## Fase 1: Fundação (1-2 semanas)

**Objetivo**: Estrutura base, Docker, DB com schema para 1 cliente

### Deliverables

- [ ] Monorepositório (pnpm workspaces)
- [ ] Docker Compose (dev)
- [ ] PostgreSQL (1 instância)
- [ ] 15 tabelas iniciais (sem `company_id`)
- [ ] NestJS bootstrapping
- [ ] Next.js bootstrapping
- [ ] Health check endpoint
- [ ] Global error handler
- [ ] Testes básicos

### Diferenças vs Multi-Tenant

- ❌ SEM validação de `companyId`
- ❌ SEM isolamento em código
- ✅ Mais simples, rápido

### Critérios de Aceite

- ✅ `docker-compose up` funciona
- ✅ API em `localhost:3001/health`
- ✅ Frontend em `localhost:3000`
- ✅ Testes > 70%
- ✅ TypeScript strict
- ✅ `npm run lint` sem erros

---

## Fase 2: Autenticação + Base (2 semanas)

**Objetivo**: Login, usuários, início da operação

### Deliverables

- [ ] Login com JWT + refresh rotativo
- [ ] Recuperação de senha
- [ ] CRUD de usuários (sem clientes múltiplos)
- [ ] Papéis (OWNER, MANAGER, ATTENDANT, WASHER, FINANCE)
- [ ] Rate limiting em login
- [ ] Primeiro acesso obrigatório
- [ ] Testes de autenticação

### Diferenças vs Multi-Tenant

- ❌ SEM admin separado (não precisa)
- ❌ SEM modo de suporte auditado (é só seu painel)
- ✅ Simples, direto

### Critérios de Aceite

- ✅ Login funciona
- ✅ Refresh token rotativo
- ✅ Primeiro acesso força nova senha
- ✅ Rate limiting bloqueia após 5 tentativas

---

## Fase 3: Cadastros Básicos (2 semanas)

**Objetivo**: Clientes, Veículos, Serviços

### Deliverables

- [ ] CRUD Clientes (sem isolamento)
- [ ] CRUD Veículos (com placa única)
- [ ] CRUD Categorias de Veículo
- [ ] CRUD Serviços
- [ ] CRUD Preços por categoria
- [ ] CRUD Funcionários
- [ ] Testes de integridade

### Critérios de Aceite

- ✅ CRUD funciona
- ✅ Placa única por instância
- ✅ Testes > 80%

---

## Fase 4: Operação (2-3 semanas)

**Objetivo**: Agenda, Ordens, Fila, Checklist

### Deliverables

- [ ] Agendamentos (calendário)
- [ ] Ordens de serviço
- [ ] Máquina de estados (DRAFT → DELIVERED)
- [ ] Fila visual
- [ ] Checklist interativo
- [ ] Upload de fotos
- [ ] Testes E2E (Playwright)

### Critérios de Aceite

- ✅ Ordem passa por todos estados
- ✅ Fila visual funciona
- ✅ Fotos uploadeadas
- ✅ Testes E2E de fluxo crítico

---

## Fase 5: Financeiro (2 semanas)

**Objetivo**: Caixa, Pagamentos, Relatórios básicos

### Deliverables

- [ ] Caixa (abrir/fechar)
- [ ] Pagamentos (dinheiro, débito, crédito)
- [ ] Despesas
- [ ] Relatório de faturamento
- [ ] Dashboard com resumo

### Critérios de Aceite

- ✅ Caixa abre/fecha
- ✅ Pagamentos registram
- ✅ Relatório funciona
- ✅ Valores em Decimal (não float)

---

## Fase 6: Estoque + Comissões (1 semana)

**Objetivo**: Inventário e comissões de funcionários

### Deliverables

- [ ] CRUD Produtos
- [ ] Movimentações de estoque
- [ ] Consumo em serviço
- [ ] Cálculo de comissão
- [ ] Relatório de comissões

### Critérios de Aceite

- ✅ Estoque atualiza automaticamente
- ✅ Comissão calculada corretamente

---

## Fase 7: Responsividade + Acabamento (1 semana)

**Objetivo**: Mobile, acessibilidade, polimento

### Deliverables

- [ ] Responsividade em mobile
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Onboarding completo
- [ ] UX polish (confirmações, toasts, etc)
- [ ] Performance otimizada

### Critérios de Aceite

- ✅ Lighthouse > 90
- ✅ Mobile-friendly
- ✅ WCAG 2.1 AA

---

## Fase 8: Deploy Automático + Admin Panel (2-3 semanas)

**Objetivo**: Infraestrutura como serviço (seu painel central)

### Deliverables

- [ ] Admin Panel (seu painel)
- [ ] CRUD de Clientes (criar, ativar, suspender)
- [ ] Billing integrado (Stripe)
- [ ] Deploy automático (GitHub Actions)
- [ ] Monitoramento (logs, alertas)
- [ ] Backup automático por cliente
- [ ] Health check de VPS

### Critérios de Aceite

- ✅ Novo cliente criado em 2 minutos (automático)
- ✅ Deploy automático funciona
- ✅ Billing integrado
- ✅ Monitoramento mostra status

---

## Fase 9: Escala + IaC (2 semanas)

**Objetivo**: Infraestrutura automática para 50+ clientes

### Deliverables

- [ ] Terraform para provisioning VPS
- [ ] Ansible para deploy
- [ ] ELK para logs centralizados
- [ ] Auto-scaling (opcional)
- [ ] Disaster recovery automatizado

### Critérios de Aceite

- ✅ Novo cliente provisiona em 5 minutos
- ✅ Logs centralizados funcionam
- ✅ Disaster recovery testado

---

## Resumo de Fases

| Fase | Foco | Duração | Complexidade |
|------|------|---------|-------------|
| 1 | Fundação | 1-2 sem | 🟢 Baixa |
| 2 | Auth + Base | 2 sem | 🟢 Baixa |
| 3 | Cadastros | 2 sem | 🟢 Baixa |
| 4 | Operação | 2-3 sem | 🟡 Média |
| 5 | Financeiro | 2 sem | 🟡 Média |
| 6 | Estoque | 1 sem | 🟢 Baixa |
| 7 | Acabamento | 1 sem | 🟢 Baixa |
| 8 | Deploy | 2-3 sem | 🔴 Alta |
| 9 | Escala | 2 sem | 🔴 Alta |

**Total**: 15-17 semanas (~4 meses)

---

## Go-Live Possível

### MVP (Mínimo Viável)

Fases 1-5 (7-8 semanas):
- ✅ Login funciona
- ✅ Agenda/ordens funcionam
- ✅ Pagamentos registram
- ✅ Um cliente pode usar

**Falta para produção**:
- Deploy automático (Fase 8)
- Estoque (Fase 6)
- Relatórios avançados (Fase 7)

### Produção Full

Fases 1-8 (14-16 semanas):
- ✅ MVP completo
- ✅ Deploy automático
- ✅ Admin panel seu
- ✅ Billing automático
- ✅ Pronto para 10-50 clientes

---

## Decisões por Fase

### Fase 1-3 (Baixa Risco)
- Code review básico
- Testes obrigatórios
- Deploy local apenas

### Fase 4-5 (Operação)
- Testes E2E críticos
- Backup de dados em teste
- Staging environment

### Fase 8-9 (Produção)
- Deploy automático rigoroso
- Disaster recovery testado
- Monitoring 24/7

---

Fim do documento de fases single-tenant.
