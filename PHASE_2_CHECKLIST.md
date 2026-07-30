# Fase 2: Autenticação e Segurança

**Status**: ✅ Completo

## ✅ Autenticação JWT

- [x] Service de autenticação com login/logout
- [x] Geração de access tokens (15m)
- [x] Geração de refresh tokens (7d)
- [x] Validação de credenciais com argon2
- [x] Armazenamento seguro de refresh tokens (hash)
- [x] Strategy Passport JWT configurada

## ✅ Endpoints de Autenticação

- [x] `POST /auth/login` - Login com email/senha
- [x] `POST /auth/logout` - Logout e revogação de sessão
- [x] `POST /auth/refresh` - Renovação de access token
- [x] `POST /auth/change-password` - Alterar senha (autenticado)

## ✅ Recuperação de Senha

- [x] `POST /password-reset/request` - Solicitar reset
- [x] `POST /password-reset/confirm` - Confirmar reset com token
- [x] Geração de tokens temporários (1h de validade)
- [x] Hash de tokens com argon2
- [x] Validação de token antes de reset

## ✅ Primeiro Acesso

- [x] Flag `isFirstLogin` no modelo User
- [x] Guard que bloqueia endpoints até mudança de senha
- [x] Endpoint `/auth/change-password` para primeiro acesso
- [x] Obrigatoriedade de senha com 8+ caracteres

## ✅ Rate Limiting

- [x] ThrottlerModule configurado globalmente (100 req/60s)
- [x] `POST /auth/login` - 5 tentativas por minuto
- [x] `POST /auth/refresh` - 5 tentativas por minuto
- [x] `POST /password-reset/request` - 3 tentativas por minuto
- [x] `POST /password-reset/confirm` - 5 tentativas por minuto

## ✅ Segurança

- [x] Validação com Zod em todos os endpoints
- [x] Senhas hasheadas com argon2
- [x] Tokens JWT com secret variável via .env
- [x] CORS pronto para configurar
- [x] Revogação de sessões ao logout
- [x] Verificação de status de usuário (ACTIVE/DISABLED)

## 📋 Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `src/modules/auth/auth.service.ts` | Lógica de autenticação |
| `src/modules/auth/auth.controller.ts` | Endpoints de auth |
| `src/modules/auth/auth.module.ts` | Módulo Auth |
| `src/modules/password-reset/password-reset.service.ts` | Lógica de reset |
| `src/modules/password-reset/password-reset.controller.ts` | Endpoints de reset |
| `src/modules/password-reset/password-reset.module.ts` | Módulo de reset |
| `src/common/strategies/jwt.strategy.ts` | Strategy Passport JWT |
| `src/common/guards/jwt-auth.guard.ts` | Guard para proteger rotas |
| `src/common/guards/first-login.guard.ts` | Guard para primeiro acesso |
| `src/common/decorators/current-user.decorator.ts` | Decorator para extrair userId |

## 🔐 Como Usar

### 1. Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}

Response:
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "João",
    "role": "OWNER",
    "isFirstLogin": true
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### 2. Primeiro Acesso - Alterar Senha

```bash
POST /auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "currentPassword": "senha_temporaria",
  "newPassword": "novaSenha123!",
  "confirmPassword": "novaSenha123!"
}

Response:
{
  "message": "Senha alterada com sucesso"
}
```

### 3. Renovar Token

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJ..."
}

Response:
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### 4. Logout

```bash
POST /auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "eyJ..."
}

Response: 204 No Content
```

### 5. Recuperação de Senha

```bash
# 1. Solicitar reset
POST /password-reset/request
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "Email de recuperação enviado",
  "resetToken": "..." // Em produção seria enviado por email
}

# 2. Confirmar reset
POST /password-reset/confirm
Content-Type: application/json

{
  "token": "...",
  "newPassword": "novaSenha123!",
  "confirmPassword": "novaSenha123!"
}

Response:
{
  "message": "Senha redefinida com sucesso"
}
```

## 🎯 Próximos Passos (Fase 3)

- [ ] Módulo de empresas (CRUD)
- [ ] Controle de permissões (RBAC)
- [ ] Integração com clientes
- [ ] Endpoints de agendamentos
- [ ] Sistema de notificações

---

**Fase 2 Status**: ✅ PRONTO PARA USAR

Toda autenticação está funcionando. Próximo: implementar módulos de negócio (Fase 3).
