# Arquitetura: Sistema Single-Tenant por Cliente
## site-lavajato

**Modelo**: Uma instância = Um lava-jato  
**Status**: Fase 0 — Análise Revisada  
**Data**: 2026-07-30

---

## 1. Visão Geral

**Nova abordagem**: Cada cliente tem sua própria **instância independente** da aplicação.

```
Você vende:           Cliente recebe:
┌──────────────────┐  ┌─────────────────────────────────────┐
│ Software License │  │ app.autobrillho.com.br              │
│ Hospedagem/Mês   │  │ - PostgreSQL próprio                │
│ Suporte/Mês      │  │ - Usuários próprios                 │
│ Manutenção/Mês   │  │ - Dados isolados por VPS            │
└──────────────────┘  └─────────────────────────────────────┘
```

### Benefícios Imediatos

✅ **Arquitetura 80% mais simples** (sem isolamento multi-tenant)  
✅ **Segurança automática** (dados em BD separado)  
✅ **Performance ótima** (sem overhead de isolamento)  
✅ **Deploy independente** (cada cliente pode atualizar quando quiser)  
✅ **Escalabilidade horizontal** (add VPS conforme cresce)  

### Trade-offs

⚠️ **Custo de infra por cliente** (1 BD + 1 VPS por cliente)  
⚠️ **Operações mais complexas** (N instâncias para gerenciar)  
⚠️ **Deploy automático necessário** (sem manual, inviável)  

---

## 2. Stack Técnico (Mesmo)

```
Frontend:     Next.js 14+ (React, TypeScript, Tailwind, shadcn/ui)
Backend:      NestJS + TypeScript + Prisma
Database:     PostgreSQL (um banco POR CLIENTE)
Infra:        Docker + Nginx + VPS Hostinger
Monorepo:     pnpm workspaces
Billing:      Painel admin centralizado seu
Deploy:       GitHub Actions → VPS automático
```

---

## 3. Estrutura de Diretórios

```
site-lavajato/
├── apps/
│   ├── web/              # Frontend (mesmo para todos clientes)
│   └── api/              # Backend (mesmo para todos clientes)
├── packages/
│   ├── types/            # Tipos compartilhados
│   ├── validation/       # Zod schemas
│   └── ui/               # Componentes UI
├── infrastructure/
│   ├── docker/           # Dockerfiles
│   ├── nginx/            # Nginx config
│   ├── scripts/          # Deploy automático
│   └── terraform/        # Opcional: IaC para VPS
├── admin-panel/          # 🆕 Painel sua gestão de clientes
├── docs/
└── README.md
```

### 🆕 Admin Panel (Seu Painel Central)

Ferramenta **separada** para você gerenciar clientes:

```
admin-panel/
├── app/
│   ├── dashboard/        # Visão geral de clientes
│   ├── clients/          # CRUD de clientes
│   ├── billing/          # Cobrança mensal
│   ├── servers/          # Status de VPS
│   ├── monitoring/       # Logs, alertas
│   └── updates/          # Deploy de versões
├── src/
└── package.json
```

---

## 4. Modelo de Dados (Ultra-Simplificado)

### Por Cliente (1 BD independente)

```
users
├── id (UUID)
├── email (UNIQUE)
├── password_hash
├── name
├── role (OWNER, MANAGER, ATTENDANT, WASHER, FINANCE)
├── status (ACTIVE, DISABLED)
└── timestamps

customers
├── id (UUID)
├── name
├── phone
├── email
└── ...

vehicles
├── id (UUID)
├── customer_id (FK)
├── plate (UNIQUE)
└── ...

services
├── id (UUID)
├── name
├── duration_minutes
└── ...

appointments
├── id (UUID)
├── customer_id (FK)
├── vehicle_id (FK)
├── service_id (FK)
└── ...

service_orders
├── id (UUID)
├── appointment_id (FK)
├── status
├── total_price
└── ...

payments
├── id (UUID)
├── service_order_id (FK)
├── amount
├── method
└── ...

employees
├── id (UUID)
├── name
├── cpf
├── role
└── ...

products
├── id (UUID)
├── name
├── quantity
└── ...

stock_movements
├── id (UUID)
├── product_id (FK)
└── ...

expenses
├── id (UUID)
├── description
├── amount
└── ...

audit_logs
├── id (UUID)
├── user_id (FK)
├── action
├── changes (JSONB)
└── ...
```

**Diferença chave**: SEM `company_id` em nada. Cada BD é de 1 cliente.

---

## 5. Autenticação (Simplificada)

### Login

```
POST /auth/login
{
  "email": "admin@autobrillho.com",
  "password": "senha123"
}

Retorna:
{
  "accessToken": "jwt...",
  "refreshToken": "token...",
  "user": {
    "id": "user_1",
    "email": "admin@...",
    "role": "OWNER"
  }
}
```

### Tokens

- **Access Token**: 15 min (JWT)
- **Refresh Token**: 7 dias (rotativo, armazenado com hash)

### Diferença vs Multi-Tenant

- ❌ SEM `companyId` no token
- ✅ Apenas `userId` + `role`
- ✅ BD separado = isolamento automático

---

## 6. Operação da Aplicação

### Por Cliente (Uso Normal)

```
1. Acessa app.autobrillho.com.br
2. Login com email/senha
3. Vê dashboard de SUA empresa
4. CRUD: Clientes, Veículos, Serviços, Ordens, etc
5. Relatórios de SUA empresa
6. Logout
```

### Diferenças vs Multi-Tenant

| Feature | Multi-Tenant | Single-Tenant |
|---------|-------------|---------------|
| Validar companyId | ✅ Obrigatório | ❌ Não existe |
| Isolamento BD | ❌ Logical | ✅ Physical (BD próprio) |
| RLS no DB | ✅ Necessário | ❌ Não precisa |
| Risco de vazamento | 🔴 Alto | ✅ Nenhum |
| Query: `WHERE company_id = X` | ✅ Todas | ❌ Nenhuma |

---

## 7. Painel Admin (Seu Painel Central)

### O que você vê

```
Dashboard Admin:
├── 📊 Clientes Ativos: 47
├── 💰 Receita Mês: R$ 12.500
├── 🚨 VPS com Problema: 2
├── 📈 Crescimento: +3 clientes
│
├── Clientes
│   ├── Auto Brilho → Status: ATIVO → Últim acesso: ontem
│   ├── Lava Jato Centro → Status: ATIVO → Últim acesso: hoje
│   └── Lava Profissional → Status: SUSPENSO
│
├── Cobrança
│   ├── Auto Brilho: R$ 290/mês (Hospedagem R$ 150 + Suporte R$ 140)
│   └── Lava Jato Centro: R$ 290/mês
│
├── Infraestrutura
│   ├── VPS 1 (4GB): 67% uso
│   ├── VPS 2 (4GB): 45% uso
│   └── VPS 3 (8GB): 78% uso
│
├── Atualizações
│   ├── v1.2.0 → Deploy para Auto Brilho ✅
│   ├── v1.2.0 → Deploy para Lava Jato Centro (aguardando)
│   └── v1.3.0 → Em testes
│
└── Suporte
    ├── Tickets abertos: 3
    ├── Tempo médio resposta: 2h
    └── Satisfação: 4.8/5
```

### Funcionalidades Admin

✅ **Gerenciamento de Clientes**
- Criar novo cliente (setup, BD, deploy)
- Suspender/cancelar cliente
- Ver dados de acesso
- Editar plano (hospedagem, suporte)

✅ **Billing Integrado**
- Gerar faturas automáticas
- Rastrear pagamentos
- Alertar inadimplência
- Aplicar descontos

✅ **Infraestrutura**
- Ver status de VPS
- Alocar recursos (CPU, RAM, disco)
- Backups automáticos por cliente
- Logs centralizados

✅ **Atualizações**
- Deploy de versão para cliente (um-por-um)
- Rollback se falhar
- Changelog por cliente
- Agendador de atualizações

✅ **Suporte**
- Tickets de clientes
- Acesso remoto a BD (debugging)
- Logs de erro de cada instância
- Comunicação com cliente

---

## 8. Deploy (O Grande Desafio)

### Fluxo de Deploy Automático

```
1. Você faz commit no GitHub
   git push origin develop

2. GitHub Actions dispara
   ✓ Build (Next.js + NestJS)
   ✓ Testes
   ✓ Lint
   ✓ Type-check

3. Se OK, imagem Docker criada
   docker build -t lavajato:v1.2.0 .

4. Você marca versão como "ready"
   Status: APPROVED FOR DEPLOY

5. Admin Panel mostra opção de deploy
   "Deploy v1.2.0 para Auto Brilho?"

6. Ao clicar, automático:
   ✓ SSH para VPS do cliente
   ✓ Pull nova imagem
   ✓ docker-compose up (nova versão)
   ✓ Migrations (se necessário)
   ✓ Health check
   ✓ Rollback automático se falhar

7. Notificar cliente
   "Seu sistema foi atualizado para v1.2.0"
```

### Estrutura de VPS por Cliente

```
/home/lavajato/
├── docker-compose.yml
├── .env                    # DB_PASSWORD, SECRET_KEY, etc
├── volumes/
│   ├── postgres/           # BD do cliente
│   ├── uploads/            # Fotos
│   └── backups/            # Backup diário
├── nginx/
│   ├── nginx.conf
│   └── ssl/                # Certificado LetsEncrypt
└── app/
    ├── web/                # Frontend (Next.js)
    ├── api/                # Backend (NestJS)
    └── backups/            # Scripts de backup
```

---

## 9. Fases de Desenvolvimento (Simplificadas)

| Fase | Foco | Duração | Mudança? |
|------|------|---------|---------|
| **0** | Arquitetura single-tenant | ✅ Agora | Completamente novo |
| **1** | Fundação (Monorepositório, Docker) | 1-2 semanas | 50% reduzido |
| **2** | Autenticação + Operação básica | 2 semanas | 50% reduzido |
| **3** | Clientes, Veículos, Serviços | 2 semanas | Igual |
| **4** | Agenda, Ordens, Fila, Checklist | 2-3 semanas | Igual |
| **5** | Caixa, Pagamentos, Relatórios | 2 semanas | Igual |
| **6** | Estoque, Comissões | 1 semana | Reduzido |
| **7** | Responsividade, Acabamento | 1 semana | Reduzido |
| **8** | Deploy automático + Admin Panel | 2-3 semanas | 🆕 Novo |
| **9** | Billing + Monitoramento | 2 semanas | 🆕 Novo |

**Total**: 15-17 semanas (~4 meses) — **3 semanas menos** que multi-tenant!

---

## 10. Segurança (Ainda Robusta)

### Autenticação

✅ Senhas com Argon2id  
✅ Refresh token rotativo  
✅ HttpOnly cookies  
✅ Rate limiting em login  
✅ Recuperação de senha segura  

### Isolamento

✅ BD físico separado por cliente (máxima segurança)  
✅ Sem risco de vazamento entre clientes  
✅ Cada cliente tem seu backup  
✅ Cada cliente pode ser restaurado independentemente  

### Admin Panel

✅ Acesso restrito ao seu painel  
✅ Logs de todas as operações admin  
✅ Dois-fatores para acesso (opcional)  
✅ Audit trail completo  

---

## 11. Operações Dia-a-Dia

### Você (Provedor)

**Segunda-feira**:
- Verificar dashboard: 2 VPS com uso alto
- Alocar mais RAM para Auto Brilho (R$ 50/mês extra)
- Aprovar deploy de v1.3.0 para 5 clientes

**Quarta-feira**:
- Gerar faturas do mês (automático)
- Enviar relatório de SLA
- 1 cliente quer mudar plano (downgrade)

**Sexta-feira**:
- Fazer backup externo de todos os BDs
- Testar disaster recovery
- Suporte: 2 tickets (um é bug, outro é dúvida)

### Cliente (Auto Brilho)

**Dia normal**:
- Abre app.autobrillho.com.br
- Vê agenda do dia
- Registra ordens de serviço
- Fecha caixa
- Gera relatório mensal

**Situações**:
- "Quero mais funcionalidades" → Você pode cobrar plano premium
- "Sofri ataque" → Você restaura BD de backup
- "Quero trocar de VPS" → Você migra (com plano pré-aprovado)

---

## 12. Modelo de Receita

### Por Cliente

```
Auto Brilho (exemplo):
├── Licença Software
│   ├── R$ 2.000 (one-time, setup)
│   └── R$ 0/mês (ou pode ser recorrente)
│
├── Hospedagem
│   ├── R$ 150/mês (VPS 4GB, 100GB disco)
│   └── R$ 50/mês (extra se crescer)
│
├── Suporte/Manutenção
│   ├── R$ 140/mês (2h/mês incluído)
│   └── Hora extra: R$ 150/h
│
└── Total/Mês: R$ 290
    Anual (3 anos): R$ 10.440 + R$ 2.000 = R$ 12.440
```

### Escala (50 clientes)

```
50 × R$ 290/mês = R$ 14.500/mês = R$ 174.000/ano

Custos VPS:
50 VPS × R$ 50/mês = R$ 2.500/mês

Lucro Bruto:
R$ 14.500 - R$ 2.500 = R$ 12.000/mês

Depois descontar:
- Seu tempo
- Ferramentas (GitHub, CI/CD)
- Suporte (talvez terceirize)
```

---

## 13. Decisões Principais

**D001**: Single-tenant com BD separado por cliente ✅  
**D002**: Mesmo código para todos (atualizar em massa) ✅  
**D003**: Deploy automático obrigatório ✅  
**D004**: Você gerencia infra + billing ✅  
**D005**: Cliente não vê admin (apenas seu painel) ✅  

---

## 14. Dúvidas Bloqueantes

### Q1: Como escalar de 1 para 50 clientes?

**Opção A**: Manual (você gerencia cada BD, deploy, backup)
- Funciona até ~10 clientes
- Depois inviável

**Opção B**: Semi-automático (scripts customizados)
- Criação de cliente: script cria BD + deploy
- Backup: cron script nightly
- Deploy: manualmente via GitHub Actions
- Funciona até ~30 clientes

**Opção C**: Totalmente automático (IaC + orquestração)
- Terraform para VPS provisioning
- Ansible para deploy
- ELK para logs centralizados
- Funciona para 100+ clientes
- Requer ~2 semanas de setup (Fase 9)

**Recomendação**: Comece com **Opção B**, migre para **Opção C** quando tiver 15-20 clientes.

---

### Q2: Onde hospedar os clientes?

**Opção A**: Hostinger (simples, barato)
- Máx ~30 clientes (limite plataforma)
- Depois muda para Opção B

**Opção B**: DigitalOcean/AWS (escalável)
- Unlimited clientes
- Mais caro
- Mais controle

**Opção C**: Hybrid (clientes pequenos em Hostinger, grandes em DO)
- Máxima flexibilidade
- Mais complexo

**Recomendação**: Hostinger agora, migrar em Fase 9.

---

### Q3: Como atualizar código em 50 clientes?

**Opção A**: Update manual em cada cliente
- Clica "Deploy v1.3.0" 50 vezes
- Funciona, tedioso

**Opção B**: "Update all" em paralelo
- Dispara 50 deploys simultaneamente
- Risco: Se falhar em 1, pode ficar inconsistente
- Requer rollback strategy

**Opção C**: Phased rollout
- Deploy em 10% primeiro (5 clientes)
- Se ok: deploy em 50%
- Se ok: deploy em 100%
- Mais seguro, 2-3 horas

**Recomendação**: **Opção C** — risco zero de problema em massa.

---

### Q4: Billing — Como cobrar?

**Opção A**: Manual (você envia faturas)
- Simples inicialmente
- Não escala

**Opção B**: Automático (integrar Stripe/PagSeguro)
- Pagamentos recorrentes
- Boleto + cartão
- Relatórios automáticos
- Melhor para escala

**Opção C**: Seu admin panel emite (customizado)
- Máximo controle
- Requer desenvolvimento

**Recomendação**: **Opção B** (Stripe) — setup rápido, profissional.

---

## 15. Próximas Ações

### Imediatamente (Você)

1. ✅ Validar que é isto mesmo que quer (single-tenant)
2. ✅ Confirmar modelo de receita (R$ 290/mês está ok?)
3. ✅ Responder Q1-Q4 acima

### Fase 0 (Arquiteto)

1. Atualizar PHASES.md com fases novas (8-9)
2. Criar DEPLOYMENT.md (fluxo de deploy automático)
3. Criar BILLING.md (Stripe integration)
4. Revisão final

### Fase 1 (Próxima)

1. Setup monorepositório
2. Docker Compose para 1 cliente
3. PostgreSQL
4. Health check
5. Testes básicos

---

## ✅ Resumo

| Aspecto | Single-Tenant | Multi-Tenant Anterior |
|---------|---|---|
| **Complexidade** | 🟢 BAIXA | 🔴 ALTA |
| **Isolamento** | Automático | Manual em cada query |
| **Custo Dev** | 15-17 semanas | 20-21 semanas |
| **Custo Infra** | ~R$ 50/cliente | Centralizado |
| **Receita/Cliente** | R$ 290/mês | Variável (SaaS) |
| **Escalabilidade** | Até ~100 clientes | Infinita |
| **Deploy** | Por cliente | Uma vez para todos |
| **Manutenção** | Média | Baixa |

---

**Conclusão**: Model muito mais simples, viável, e com receita clara.

Próximo: Validar Q1-Q4 → Replanejar Phases.md
