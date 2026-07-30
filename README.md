# Site Lavajato 🚗

**Sistema de Gestão para Lava-Jatos**

> Um software profissional para gerenciar operações de lava-jato. **Uma licença = Um lava-jato**. Você vende software + hospedagem + suporte.

**Status**: 🔨 Fase 0 — Arquitetura (Revisada para Single-Tenant)  
**Modelo**: Single-tenant (instância independente por cliente)  
**Próxima Fase**: Fase 1 — Fundação

---

## 📋 Visão Rápida

### O Produto

```
Você fornece:                Cliente recebe:
┌─────────────────────┐      ┌──────────────────────────────┐
│ Software License    │      │ app.seulavajato.com.br       │
│ Hospedagem/Mês      │  →   │ - PostgreSQL (seu próprio)   │
│ Suporte/Mês         │      │ - Usuários (seu próprio)     │
│ Manutenção/Mês      │      │ - Dados (totalmente isolados)│
└─────────────────────┘      └──────────────────────────────┘
```

### Benefícios

✅ **Arquitetura simples** (sem isolamento multi-tenant)  
✅ **Segurança total** (BD separado = dados seguros)  
✅ **Performance ótima** (sem overhead de isolamento)  
✅ **Receita clara** (R$ 290/mês por cliente, exemplo)  
✅ **Escalável** (até 50+ clientes)  

### Modelo de Negócio

```
Por Cliente:
├── Licença: R$ 2.000 (one-time)
├── Hospedagem: R$ 150/mês
├── Suporte: R$ 140/mês
└── Total: R$ 290/mês

Escala (50 clientes):
└── R$ 14.500/mês = R$ 174.000/ano
    (Descontar custos: R$ 2.500/mês infra)
```

---

## 🎯 Funcionalidades (MVP)

- ✅ **Autenticação** — Login com JWT + refresh rotativo
- ✅ **Operação** — Agenda, ordens, fila, checklist
- ✅ **Pagamentos** — Caixa, recebimentos, despesas
- ✅ **Relatórios** — Faturamento, clientes, funcionários
- ✅ **Estoque** — Produtos, movimentações, comissões
- ✅ **Mobile-First** — Otimizado para tablet/celular

---

## 🏗️ Arquitetura

### Stack

```
Frontend:    Next.js 14+ (React, TypeScript, Tailwind, shadcn/ui)
Backend:     NestJS + TypeScript + Prisma
Database:    PostgreSQL (1 por cliente)
Infra:       Docker + Nginx + VPS Hostinger
Deploy:      GitHub Actions (automático)
Billing:     Stripe (seu painel)
```

### Estrutura

```
site-lavajato/
├── apps/
│   ├── web/           # Frontend (Next.js)
│   └── api/           # Backend (NestJS)
├── packages/
│   ├── types/         # Tipos compartilhados
│   ├── validation/    # Zod schemas
│   └── ui/            # Componentes UI
├── admin-panel/       # 🆕 Seu painel de gestão
├── infrastructure/    # Docker, Nginx, scripts
├── docs/              # Documentação
└── README.md
```

---

## 📚 Documentação

### Fase 0 (Atual)

- **[ARCHITECTURE_SINGLE_TENANT.md](docs/ARCHITECTURE_SINGLE_TENANT.md)** — Visão geral, modelo, integração
- **[PHASES_SINGLE_TENANT.md](docs/PHASES_SINGLE_TENANT.md)** — 9 fases de desenvolvimento
- Este README

### Próximos Documentos (Fase 1+)

- `DATABASE.md` — Schema, migrations
- `DEPLOYMENT.md` — Deploy automático
- `BILLING.md` — Stripe integration
- `SETUP.md` — Local development
- `ADMIN_PANEL.md` — Seu painel central

---

## 🚀 Phases & Timeline

| Fase | O que | Semanas |
|------|-------|---------|
| **1** | Fundação (Docker, DB, API/Web) | 1-2 |
| **2** | Login + Usuários | 2 |
| **3** | Clientes, Veículos, Serviços | 2 |
| **4** | Agenda, Ordens, Fila | 2-3 |
| **5** | Pagamentos, Caixa, Relatórios | 2 |
| **6** | Estoque, Comissões | 1 |
| **7** | Mobile, Acabamento | 1 |
| **8** | Deploy Automático + Admin Panel | 2-3 |
| **9** | IaC, Escala (50+ clientes) | 2 |

**Total**: 15-17 semanas (~4 meses)

---

## 💰 Modelo de Receita

### Por Cliente

```
Setup (one-time):
└── R$ 2.000 (licença)

Recorrente (mensal):
├── R$ 150 (hospedagem VPS)
├── R$ 140 (suporte/manutenção)
└── Total: R$ 290/mês

Crescimento (escalável):
├── Upgrade para VPS maior: +R$ 50/mês
├── Suporte premium (24h): +R$ 200/mês
└── Consultoria: R$ 250/h
```

### Escala (Projeção)

```
Cenários:

10 clientes:    R$ 2.900/mês  (viável, gerenciável)
25 clientes:    R$ 7.250/mês  (escala para Opção B - automação)
50 clientes:    R$ 14.500/mês (robusto, lucrativo)
100 clientes:   R$ 29.000/mês (requer automação total)
```

---

## 🔒 Segurança

### Autenticação

- JWT com access token curto (15 min)
- Refresh token rotativo (7 dias)
- Senhas com Argon2id
- Rate limiting (5 tentativas / 15 min)
- HttpOnly + Secure cookies

### Isolamento

✅ **Garantido fisicamente**: Cada cliente tem seu próprio banco de dados  
✅ **Sem risco**: Impossível vazamento entre clientes  
✅ **Backups independentes**: Cada cliente pode ser restaurado sozinho  

---

## 📊 Modelo de Dados (Simplificado)

### Por Cliente (1 BD independente)

```
users
├── id, email (UNIQUE), password_hash, role, status

customers
├── id, name, phone, email

vehicles
├── id, customer_id, plate (UNIQUE), make, model

services
├── id, name, duration_minutes

appointments
├── id, customer_id, vehicle_id, service_id, date_time

service_orders
├── id, appointment_id, status (máquina de estados), total_price

payments
├── id, service_order_id, amount, method

employees
├── id, name, cpf, role

products
├── id, name, quantity

stock_movements
├── id, product_id, quantity, type

expenses
├── id, description, amount, date

audit_logs
├── id, user_id, action, changes (JSONB)
```

**Diferença chave**: SEM `company_id` em lugar nenhum. Cada BD = 1 cliente.

---

## 🎛️ Admin Panel (Seu Painel)

Você terá um painel **separado** para gerenciar clientes:

```
admin-panel/
├── Dashboard
│   ├── Clientes ativos: X
│   ├── Receita mês: R$ X
│   ├── VPS problemas: X
│   └── Taxa de satisfação: X%
│
├── Clientes
│   ├── Criar novo cliente (setup automático)
│   ├── Suspender/Cancelar
│   ├── Ver detalhes
│   └── Editar plano
│
├── Billing
│   ├── Gerar faturas
│   ├── Rastrear pagamentos
│   ├── Alertar inadimplência
│   └── Aplicar descontos
│
├── Infraestrutura
│   ├── Ver status de VPS
│   ├── Alocar recursos
│   ├── Backups
│   └── Logs centralizados
│
├── Deploy
│   ├── Versões disponíveis
│   ├── Deploy para cliente
│   ├── Rollback se falhar
│   └── Agendador
│
└── Suporte
    ├── Tickets de clientes
    ├── Acesso remoto a BD
    ├── Comunicação
    └── Conhecimento base
```

---

## ⚙️ Próximos Passos

### Imediatamente

1. ✅ Validar modelo single-tenant (é isto?)
2. ✅ Confirmar modelo de receita (R$ 290/mês faz sentido?)
3. ✅ Responder dúvidas bloqueantes em ARCHITECTURE_SINGLE_TENANT.md (Q1-Q4)

### Fase 0 Completa

- ✅ Arquitetura validada
- ✅ Documentação técnica pronta
- ✅ Roadmap claro

### Fase 1

- Setup monorepositório
- Docker Compose
- PostgreSQL
- Primeiros endpoints
- Testes básicos

---

## 🤔 Dúvidas Frequentes

**P: Por que single-tenant e não multi-tenant?**
R: Mais simples, mais seguro, receita clara, escalável até 100+ clientes.

**P: Como cobro atualizações?**
R: Atualizações são inclusas no plano. Você faz deploy para todos quando quer.

**P: E se cliente quer mudar algo?**
R: Customizações são pagas à parte (consultoria). Sistema mantém template.

**P: Quanto tempo para MVP?**
R: 7-8 semanas (Fases 1-5). Produção full: 14-16 semanas.

**P: Escalabilidade?**
R: Até ~50 clientes manualmente. 50+ requer automação (Fase 9).

---

## 📄 Licença

Privado — Desenvolvido para uso específico.

---

**Documentação Detalhada**: Veja `docs/` → Comece em [ARCHITECTURE_SINGLE_TENANT.md](docs/ARCHITECTURE_SINGLE_TENANT.md)

---

Pronto para começar? Valide as decisões e vamos para a **Fase 1: Fundação** 🚀
