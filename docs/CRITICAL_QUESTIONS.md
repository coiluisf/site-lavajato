# Dúvidas Bloqueantes e Questões Críticas

**Status**: Fase 0 — Análise  
**Data**: 2026-07-30

Estas são questões que podem impactar significativamente a arquitetura ou que apenas o cliente pode decidir.

---

## 🔴 Dúvidas Bloqueantes (Decisões Necessárias)

### Q1: Armazenamento de Fotos/Imagens

**Impacto**: MÉDIO | **Bloqueia**: Fase 4  
**Contexto**: Serviços incluem fotos de entrada, durante e saída do veículo.

**Opções**:

A. **Volume Persistente Local** (recomendado para MVP)
   - Armazenar em `/data/uploads` dentro do container
   - Backup via volume persistente Docker
   - Simples, sem custo adicional
   - Cons: Se volume se perder, fotos sumirem; transfer lento entre servidores

B. **S3 ou Object Storage** (escalável)
   - DigitalOcean Spaces, Backblaze B2, AWS S3
   - Escalável, com CDN integrado
   - Cons: Custo mensal, complexidade de integração

**Recomendação da Arquitetura**: Opção A para MVP (Fase 1-7), migrar para B em Fase 8+ se necessário.

**Sua Decisão**: ___________________

---

### Q2: Nota Fiscal / NFe

**Impacto**: ALTO | **Bloqueia**: Fase 5 (financeiro) ou Fase 8 (produção)?  
**Contexto**: Empresa precisa emitir recibos/notas fiscais por lei.

**Opções**:

A. **Manual** (MVP)
   - Sistema apenas controla pagamento
   - Usuário emite nota fiscal por fora (RFB, consultório, etc)
   - Rápido, sem integração

B. **Nuvem Fiscal** (Fase 8+)
   - Integração com plataforma de emissor (Nuvem Fiscal, Hotmart)
   - Automático, mais caro
   - Requer account com fiscal

C. **Integração RFB Direta** (complexo)
   - NFe direto com Receita
   - Requer certificado digital
   - Muito complexo, não recomendado para MVP

**Recomendação da Arquitetura**: Opção A para MVP. Opção B em Fase 8+ com suporte adicional.

**Sua Decisão**: ___________________

---

### Q3: Iniciar Desenvolvimento Sem NFe?

**Impacto**: CRÍTICO | **Bloqueia**: Tudo?  
**Contexto**: Relacionado a Q2 acima.

**Pergunta**: Lava-jato precisa de NFe emitida automaticamente no dia 1 de produção, ou pode começar emitindo manualmente?

**Resposta Necessária**: 
- [ ] Sim, NFe automática é requisito (vai para Fase 8 como pré-requisito)
- [ ] Não, pode começar manual (implementa em Fase 8+)

**Impacto se Sim**: Adiciona 2-3 semanas na Fase 8 (integração fiscal)

---

### Q4: Row-Level Security (RLS) do PostgreSQL

**Impacto**: MÉDIO | **Bloqueia**: Fase 2  
**Contexto**: Defesa adicional contra bugs que podem expor dados entre empresas.

**Opções**:

A. **Sem RLS** (Fase 1 pode iniciar assim)
   - Confiar apenas em validação de aplicação
   - Mais simples
   - Risco: Bug em app = vazamento de dados

B. **Com RLS** (implementar Fase 2)
   - Banco valida isolamento automaticamente
   - Mesmo se app fizer query errada, DB protege
   - Cons: Complexidade adicional no backend, overhead de performance (mínimo)

**Recomendação**: Opção B — adiciona segurança sem grande custo.

**Sua Decisão**: ___________________

---

### Q5: Fuso Horário

**Impacto**: BAIXO | **Bloqueia**: Fase 1  
**Contexto**: Qual fuso horário para timestamps de operação?

**Opções**:

A. **Hardcoded America/Sao_Paulo** (recomendado)
   - Todas as datas em São Paulo
   - Simples
   - Se cliente depois estiver em outro estado, valor será menor

B. **Configurável por Empresa** (complexidade extra)
   - Cada lava-jato configura seu fuso
   - Mais flexível
   - Mais complexo no código

**Recomendação**: Opção A para MVP. Mudar para B depois é fácil.

**Sua Decisão**: ___________________

---

### Q6: Emissão de Recibos (Formato)

**Impacto**: BAIXO | **Bloqueia**: Fase 5  
**Contexto**: Formato do comprovante de pagamento.

**Opções**:

A. **PDF Simples** (recomendado)
   - Gerar PDF com dados básicos
   - Imprimir ou enviar por email/WhatsApp
   - Simples, sem integração

B. **Integração com Impressora Térmica**
   - Prints automáticos
   - Requer driver de impressora
   - Mais complexo

**Recomendação**: Opção A para MVP. Opção B em Fase 5+ se necessário.

**Sua Decisão**: ___________________

---

### Q7: Relatórios Iniciais

**Impacto**: BAIXO | **Bloqueia**: Fase 7  
**Contexto**: Quais relatórios são critério MVP?

**Opções**:

A. **Básico** (recomendado)
   - Faturamento por período
   - Clientes mais ativos
   - Funcionários (comissões)
   - Dashboard com resumo

B. **Completo**
   - Tudo acima + análises avançadas
   - Gráficos complexos
   - Exportação múltipla

**Recomendação**: Opção A para MVP. Opção B em Fase 7+ conforme feedback.

**Sua Decisão**: ___________________

---

## ⚠️ Riscos Técnicos

### R001: Vazamento de Dados Entre Empresas
**Severidade**: 🔴 CRÍTICA  
**Probabilidade**: Média (sem testes)  
**Mitigação**:
- Testes automáticos de isolamento em cada feature
- Code review focado em isolamento
- RLS no DB (Fase 2)
- Monitoramento de audit logs em produção

---

### R002: Ataque de Força Bruta em Login
**Severidade**: 🔴 CRÍTICA  
**Probabilidade**: Alta (sem rate limiting)  
**Mitigação**:
- Rate limiting (5 tentativas / 15 min)
- Bloqueio temporário (15 min)
- Logging de tentativas suspeitas
- Alert em admin para múltiplas falhas

---

### R003: Roubo de Token/Sessão
**Severidade**: 🔴 CRÍTICA  
**Probabilidade**: Baixa (com HttpOnly cookies)  
**Mitigação**:
- HttpOnly cookies (JS não pode acessar)
- Secure flag (HTTPS only)
- SameSite=Strict (não cross-domain)
- Refresh token rotativo (roubo detectado)
- Validação de UserAgent + IP (opcional Fase 2)

---

### R004: Corrupção de Dados Financeiros
**Severidade**: 🔴 CRÍTICA  
**Probabilidade**: Baixa (com transações)  
**Mitigação**:
- Transações de banco (ACID)
- Constraints de integridade
- Soft delete (nunca hard delete)
- Audit log de todas as operações financeiras
- Backup diário fora da VPS

---

### R005: Performance Degradada sob Carga
**Severidade**: 🟡 MÉDIA  
**Probabilidade**: Média (sem índices)  
**Mitigação**:
- Índices compostos no companyId
- Query analysis antes de deploy
- Caching com Redis (Fase 2+)
- Load testing antes de produção

---

### R006: Perda de Dados por Falha de Infra
**Severidade**: 🔴 CRÍTICA  
**Probabilidade**: Baixa (com backups)  
**Mitigação**:
- Backups diários do banco
- Armazenamento fora da VPS (AWS S3 ou Drive)
- RTO < 1 hora
- Testes de restore mensal

---

### R007: Exposição de Secrets no Repositório
**Severidade**: 🔴 CRÍTICA  
**Probabilidade**: Média (humano)  
**Mitigação**:
- .env.example SEM credenciais
- .gitignore rigoroso
- Secret scanning em CI/CD
- Code review antes de merge
- Educação da equipe

---

### R008: Compliance LGPD (Privacidade)
**Severidade**: 🟡 ALTA  
**Probabilidade**: Alta (não implementado)  
**Mitigação**:
- Documentação de política de privacidade
- Direito de acesso aos dados (exportação)
- Direito de ser esquecido (anonimização)
- Consentimento para comunicações
- Retenção de fotos (deletar após X dias)

---

### R009: Escalabilidade com Crescimento
**Severidade**: 🟠 MÉDIA  
**Probabilidade**: Baixa (MVP não vai escalar 10x overnight)  
**Mitigação**:
- Arquitetura modular preparada
- Índices de banco otimizados
- Possibilidade de Redis/cache depois
- Monitoramento de performance
- Plano de scale-out em Fase 8+

---

## 🎯 Checklist Crítico de Segurança

- [ ] Toda tabela de negócio tem `company_id`
- [ ] Nenhuma query sem validação de `company_id`
- [ ] `companyId` vem SEMPRE do JWT (nunca do cliente)
- [ ] Rate limiting em login configurado
- [ ] Senhas com Argon2id (não bcrypt/MD5)
- [ ] Refresh token é rotativo e armazenado com hash
- [ ] Cookies são HttpOnly + Secure + SameSite
- [ ] Testes de isolamento multi-tenant escritos
- [ ] Testes de autorização em todos os endpoints
- [ ] Audit log de ações críticas
- [ ] .env.example não tem secrets
- [ ] HTTPS forçado em produção
- [ ] Backup diário testado
- [ ] Documentação de fluxo de segurança

---

## 📋 Checklist de Go-Live (Fase 8)

Antes de liberar para produção:

- [ ] Todos os testes passando
- [ ] Code coverage > 80%
- [ ] Lint/type-check sem erros
- [ ] RLS do banco testado
- [ ] Backup automático configurado e testado
- [ ] Monitoramento ativo
- [ ] Alert de erros configurado
- [ ] HTTPS com certificado válido
- [ ] Headers de segurança (HSTS, CSP)
- [ ] Rate limiting em todos endpoints públicos
- [ ] Documentação de operação completa
- [ ] Plano de disaster recovery
- [ ] Educação da equipe de suporte
- [ ] SLA de uptime definido

---

## 📞 Próximos Passos

**Para você (Cliente)**:
1. Responder as 7 dúvidas acima (Q1-Q7)
2. Validar lista de riscos (concorda com mitigações?)
3. Dar aprovação para começar Fase 1

**Para o Arquiteto**:
1. Receber feedback
2. Atualizar documentação conforme necessário
3. Iniciar Fase 1 (Fundação)

---

Questões? Dúvidas? Envie feedback sobre os pontos acima.
