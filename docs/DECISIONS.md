# Log de Decisões Arquiteturais

**Status**: Fase 0 — Análise Completa  
**Data**: 2026-07-30

---

## Decisões Tomadas

### D001: Stack Tecnológico

**Decisão**: Frontend Next.js 14+, Backend NestJS, PostgreSQL + Prisma  
**Justificativa**:
- Next.js: App Router moderno, SSR/SSG, deploy simplificado, comunidade grande
- NestJS: Framework maduro, decorators, DI, estrutura clara para Backend
- PostgreSQL: ACID, constraints, índices, RLS, suporta JSON, escalável
- Prisma: Type-safe ORM, migrations automáticas, developer experience excelente

**Alternativas Consideradas**:
- Express.js (mais simples, menos estrutura) → Rejeitado por falta de estrutura
- FastAPI/Python (ótimo mas não é Node.js) → Fora de escopo
- MySQL (não tem RLS nativo) → Rejeitado

**Reversibilidade**: Média (trocar ORM é fácil, trocar DB é difícil)

---

### D002: Modelo de Autenticação

**Decisão**: JWT access token (15 min) + Refresh token rotativo (7 dias, armazenado com hash)  
**Justificativa**:
- Access token curto = risco limitado de vazamento
- Refresh token rotativo = detecção automática de roubo (token não será mais válido)
- Hash do refresh no banco = não perde segurança mesmo se refresh_token.txt vazar
- Simples de implementar, sem dependencies pesadas (Redis)

**Alternativas Consideradas**:
- Apenas cookies de sessão (sem JWT) → Mais simples mas sem mobile-friendly
- Opaque tokens + Redis → Mais seguro mas requer infraestrutura
- OAuth2/OpenID (terceiros) → Fora do escopo do MVP

**Reversibilidade**: Média (mudar de JWT para sessão requer refactor no frontend/backend)

---

### D003: Isolamento Multi-Tenant

**Decisão**: Row-Level Tenancy com `companyId` validado em cada query + RLS no DB (fase 2+)  
**Justificativa**:
- Simples e explícito (fácil para devs entender)
- Escalável (sem sharding necessário)
- Seguro (defesa em camadas: aplicação + database)
- Performance boa (índices no companyId)

**Alternativas Consideradas**:
- Separate databases per tenant → Escalabilidade cara, hard limits, complex ops
- Schema per tenant (PostgreSQL schemas) → Possível mas menos flexível
- Apenas aplicação (sem RLS) → Risco maior de bugs

**Reversibilidade**: Baixa (está no core do design, mudar depois é custoso)

---

### D004: Papéis e Permissões

**Decisão**: 5 papéis iniciais (OWNER, MANAGER, ATTENDANT, WASHER, FINANCE) + permissões extensíveis  
**Justificativa**:
- 5 papéis cobrem 95% dos casos iniciais
- Sistema de permissões (não hardcoded) permite expansão sem código
- Guards + Decorators centralizam validação

**Alternativas Consideradas**:
- Papéis hardcoded (sem sistema de permissões) → Inflexível
- RBAC muito genérico desde o início → Overengineering

**Reversibilidade**: Alta (adicionar novos papéis é fácil)

---

### D005: Modo de Suporte Auditado

**Decisão**: Admin cria sessão de suporte explícita com motivo, ações auditadas, identidade preservada  
**Justificativa**:
- Rastreabilidade: Saber exatamente quem fez o quê
- Segurança: Sem "impersonação silenciosa"
- Compliance: Atende LGPD + requisitos internos

**Alternativas Consideradas**:
- Admin usa credenciais do cliente (NÃO SEGURO)
- Admin faz login como cliente por trás das cenas → Perde identidade real

**Reversibilidade**: Alta (é feature, não core)

---

### D006: Primeiro Acesso Obrigatório

**Decisão**: Admin gera senha temporária, usuário é forçado a criar nova senha no primeiro login  
**Justificativa**:
- Admin nunca conhece senha permanente do usuário
- Segurança: Cada usuário responsável pela sua senha

**Alternativas Consideradas**:
- Email com link de reset automático → Mais UX-friendly mas requer email funcionando
- Compartilhar senha permanente com admin → Inseguro

**Reversibilidade**: Média (pode adicionar email link depois)

---

### D007: Monorepositório com pnpm Workspaces

**Decisão**: Monorepo (não monolith): `apps/web`, `apps/api`, `packages/*`  
**Justificativa**:
- Compartilhamento de tipos, validações, componentes UI
- Deploy junto (versionamento sincronizado)
- Mais simples que repositórios separados
- Sem Turborepo inicialmente (add se performance virar problema)

**Alternativas Consideradas**:
- Repositórios separados → Sincronizar versões é mais difícil
- Monolith completo (api + web no mesmo código) → Dificulta deploy independente

**Reversibilidade**: Média (split depois é possível mas trabalhoso)

---

### D008: Docker Compose para Dev, VPS para Prod

**Decisão**: Docker Compose local, Docker Compose + Nginx em VPS Hostinger  
**Justificativa**:
- Dev: Pré-requisitos zero no computador (só Docker)
- Prod: Simples, sem Kubernetes
- Hostinger: Suporta Docker nativo

**Alternativas Consideradas**:
- Kubernetes desde o início → Overengineering
- Setup manual (sem Docker) → Inconsistência entre devs

**Reversibilidade**: Alta (migrar para K8s depois é possível)

---

### D009: Sem Redis Inicialmente

**Decisão**: Não incluir Redis na Fase 1  
**Justificativa**:
- Não necessário para MVP (session storage no banco é ok)
- Reduz complexidade e dependências
- Adicionar depois quando necessário é fácil

**Alternativas Consideradas**:
- Redis desde o início para cache/sessions → Unnecessary complexity

**Reversibilidade**: Muito alta (add Redis é trivial)

---

### D010: Soft Delete (Soft Delete sim para negócio, não para auditoria)

**Decisão**: 
- Entidades de negócio (customers, vehicles): Soft delete (deletedAt)
- Entidades de auditoria (audit_logs, payments): Hard delete nunca

**Justificativa**:
- Preservar histórico de dados
- Impossível acidentalmente apagar
- Financeiro pode rastrear histórico

**Alternativas Consideradas**:
- Hard delete sempre → Perda de histórico
- Soft delete em tudo → Tables incham desnecessariamente

**Reversibilidade**: Alta

---

### D011: UUID para IDs Públicos

**Decisão**: UUIDs (v4) para todos os IDs públicos, sequenciais (INTEGER) apenas internos  
**Justificativa**:
- Evita enumeração de recursos (não dá para adivinhar IDs)
- Segurança: IDs não revelam quantidade de dados
- Standard na indústria

**Alternativas Consideradas**:
- Sequencial (AUTO_INCREMENT) → Enumerável (segurança)
- CUID → Similar ao UUID, menos compatível

**Reversibilidade**: Muito baixa (mudar depois quebra tudo)

---

### D012: Valores Monetários em Decimal

**Decisão**: DECIMAL(10, 2) para todos os valores monetários, nunca float  
**Justificativa**:
- Float tem imprecisão (0.1 + 0.2 ≠ 0.3)
- Decimal é exato para dinheiro
- ACID em transações financeiras

**Alternativas Consideradas**:
- Float (NUNCA para dinheiro)
- BigInt em centavos → Possível mas menos legível

**Reversibilidade**: Muito baixa

---

### D013: TypeScript Strict em Toda Parte

**Decisão**: `strict: true` no tsconfig.json, sem `any` permitido  
**Justificativa**:
- Detecta bugs em compile-time
- Documentação viva (tipos são claros)
- Refactoring seguro

**Alternativas Consideradas**:
- TypeScript normal (strict: false) → Falhas runtime

**Reversibilidade**: Média (habilitar strict em código sem type quebra)

---

### D014: Zod para Validação de Schema

**Decisão**: Zod (não class-validator, não JSON Schema)  
**Justificativa**:
- Type-safe (inferir tipos TypeScript do schema)
- Composable (reutilizar schemas)
- Excelente documentação
- Funciona no frontend e backend

**Alternativas Consideradas**:
- class-validator + class-transformer → Não type-safe por padrão
- JSON Schema → Mais verboso, sem suporte TypeScript nativo

**Reversibilidade**: Média

---

### D015: Tailwind CSS + shadcn/ui para Frontend

**Decisão**: Tailwind (utility-first CSS) + shadcn/ui (componentes Radix)  
**Justificativa**:
- Tailwind: Rápido, consistente, sem CSS custom necessário
- shadcn/ui: Acessível, customizável, componentes bem feitos
- Juntos: Excelente DX, componentes prontos

**Alternativas Consideradas**:
- Bootstrap → Menos flexível, mais opinionated
- Material-UI → Mais pesado, menos customizável

**Reversibilidade**: Alta (componentes podem mudar depois)

---

### D016: Sem Integração de Pagamento no MVP

**Decisão**: Pagamentos manuais apenas (Fase 1-5), gateway na Fase 8+  
**Justificativa**:
- MVP pode operar sem
- Gateway adiciona complexidade (PCI compliance, testes)
- Lógica de negócio não depende disso
- Add depois é simples

**Alternativas Consideradas**:
- Integrar Stripe/Square desde o início → Complexity overhead

**Reversibilidade**: Muito alta

---

### D017: Sem Nota Fiscal no MVP

**Decisão**: Lógica de pagamento/receita em produção, nota fiscal na Fase 8+  
**Justificativa**:
- NFe é regulatória, não operacional
- MVP funciona sem (empresa emite manual)
- Integração requer consulta a accountant
- Add depois sem refactor

**Alternativas Consideradas**:
- Tentar integrar NFC-e/NFe desde início → Bloqueador regulatório

**Reversibilidade**: Muito alta

---

### D018: Localização em pt-BR, Fuso America/Sao_Paulo

**Decisão**: Hardcoded nas datas de negócio (não por usuário)  
**Justificativa**:
- Sistema é 100% Brasil inicialmente
- Dados persistidos em UTC no banco
- Frontend converte para pt-BR/São Paulo
- Multi-idioma é futuro (Fase 8+)

**Alternativas Consideradas**:
- Multi-idioma desde o início → Overengineering

**Reversibilidade**: Alta (mudar de fuso depois é fácil com timezone-aware dates)

---

### D019: Documentação em Markdown

**Decisão**: Docs versionadas em Git (Markdown em `docs/`)  
**Justificativa**:
- Versioning automático
- Fácil diffs
- Pode ser colocada em wiki depois

**Alternativas Consideradas**:
- Wiki separada → Desincronizado com código
- Notion → Silo, difícil versionamento

**Reversibilidade**: Muito alta

---

### D020: Testes Obrigatórios (não optionals)

**Decisão**: Testes de isolamento multi-tenant, testes de autorização, testes E2E críticos são obrigatórios  
**Justificativa**:
- Segurança não é opcional
- Vazamento de dados é irreversível
- Testes automatizam validação

**Alternativas Consideradas**:
- Testes opcionais ("depois testamos") → Bugs em produção

**Reversibilidade**: N/A (sempre necessário)

---

## Decisões Pendentes (Aguardando Feedback)

### P001: Armazenamento de Fotos

**Opção A**: S3 ou Object Storage (DigitalOcean Spaces, Backblaze B2)
- Pros: Escalável, bom para muitas fotos, CDN integrado
- Cons: Custo adicional, complexidade

**Opção B**: Volume persistente local
- Pros: Simples, sem custo adicional
- Cons: Backup complexo, se perde volume = perde fotos

**Recomendação**: Opção B para MVP (volume persistente), migrar para S3 em Fase 8+ quando escalar.

**Questão**: Preferência do cliente?

---

### P002: Emissão de Nota Fiscal

**Opção A**: Integrar com Nuvem Fiscal
**Opção B**: Integrar com RFB direto (NFe)
**Opção C**: Não emitir automaticamente (manual)

**Recomendação**: Opção C para MVP, Opção A em Fase 8+ (mais simples que RFB)

**Questão**: Precisão fiscal é requisito no dia 1?

---

### P003: Row-Level Security (RLS) do PostgreSQL

**Opção A**: Implementar desde Fase 1
**Opção B**: Implementar na Fase 2 (defesa adicional)
**Opção C**: Não implementar (confiar apenas em aplicação)

**Recomendação**: Opção B (Fase 2) — adiciona segurança mas complexidade no backend.

**Questão**: Vale o trade-off?

---

### P004: Fuso Horário Configurável por Empresa

**Opção A**: Hardcoded America/Sao_Paulo
**Opção B**: Configurável por empresa

**Recomendação**: Opção A para MVP.

**Questão**: Necessário no dia 1?

---

### P005: Platform Admin x User unificado

**Opção A**: Tabelas separadas (`users` vs `platform_admins`)
- Pros: Separação clara, sem confusão
- Cons: Duplicação (password_reset_tokens, sessions, etc)

**Opção B**: Tabela unificada com `type` (ADMIN, CLIENT)
- Pros: DRY, menos duplicação
- Cons: Mais lógica para separar, risco de confusão

**Recomendação**: Opção A (tabelas separadas) — clareza > DRY.

**Questão**: Concorda?

---

## Riscos Mitigados

| Risco | Severidade | Mitigação Escolhida |
|-------|-----------|---------------------|
| Vazamento de dados entre empresas | CRÍTICA | Validação em 3 camadas (guard, service, DB RLS) + testes automáticos |
| Roubo de senha | ALTA | Argon2id + força mínima + histórico |
| Roubo de token | ALTA | HttpOnly cookies + refresh rotativo |
| Força bruta em login | ALTA | Rate limiting 5/15min + bloqueio temporário |
| Corrupção de dados | ALTA | Transações + constraints + soft delete |
| Perda de dados | ALTA | Backups diários fora da VPS |
| Performance degradada | MÉDIA | Índices no companyId + caching (Redis Fase 2+) |
| Impersonação silenciosa | ALTA | Modo de suporte auditado, identidade preservada |

---

## Débitos Técnicos Aceitáveis

| Débito | Quando Resolver | Motivo |
|--------|-----------------|---------|
| Logging simples | Fase 5+ | Agregar logs não é critério MVP |
| Rate limiting básico | Fase 3+ | Refinado conforme necessário |
| Sem CI/CD full | Fase 8 | Build + test local é ok |
| Sem testes E2E | Fase 4 | Críticos apenas para operação |
| Sem Redis | Fase 2+ | Add quando necessário |
| Sem RLS do DB | Fase 2 | Defesa aplicação é suficiente Fase 1 |
| Sem monitoramento | Fase 8 | Não crítico pré-produção |

---

Fim do documento de decisões.
