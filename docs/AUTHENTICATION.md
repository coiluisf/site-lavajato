# Estratégia de Autenticação e Sessões

**Status**: Fase 0 — Análise  
**Data**: 2026-07-30  
**Versão**: 1.0

---

## 1. Visão Geral

O sistema possui **duas estruturas de autenticação independentes**:

1. **Clientes** (Lava-jatos): Login em `app.seudominio.com.br`
2. **Administradores** (Plataforma): Login em `admin.seudominio.com.br`

Cada uma com suas próprias tabelas, tokens e políticas.

---

## 2. Fluxo de Autenticação de Cliente

### 2.1 Login

```
┌────────────────────────────────────────────────────────┐
│ POST /auth/login                                       │
│ {                                                      │
│   "email": "admin@autobrillho.com",                   │
│   "password": "senha123"                              │
│ }                                                      │
└────────────────┬─────────────────────────────────────┘
                 ↓
        ┌────────────────────────┐
        │ Validações            │
        ├────────────────────────┤
        │ 1. Email existe?      │
        │ 2. Senha correta?     │
        │ 3. User ativo?        │
        │ 4. Empresa ativa?     │
        │ 5. Primeiro acesso?   │
        └────────┬───────────────┘
                 ↓
    ┌─────────────────────────────────────┐
    │ Gerar Access Token (JWT)            │
    │ ─────────────────────────────────   │
    │ {                                   │
    │   "userId": "user_123",             │
    │   "companyId": "company_47",        │
    │   "role": "OWNER",                  │
    │   "iat": 1722370800,                │
    │   "exp": 1722371700  (15 min)       │
    │ }                                   │
    │ Assinado com RS256 (private key)    │
    └────────────┬────────────────────────┘
                 ↓
    ┌─────────────────────────────────────┐
    │ Gerar Refresh Token                 │
    │ ─────────────────────────────────   │
    │ 1. Token aleatório (32 bytes)       │
    │ 2. Hash com Argon2id                │
    │ 3. Armazenar no banco com metadata  │
    │ 4. Válido por 7 dias                │
    └────────────┬────────────────────────┘
                 ↓
    ┌─────────────────────────────────────┐
    │ Resposta HTTP 200                   │
    │ ─────────────────────────────────   │
    │ Cookie: access_token=jwt_value      │
    │   HttpOnly, Secure, SameSite=Strict │
    │                                     │
    │ Cookie: refresh_token=token_value   │
    │   HttpOnly, Secure, SameSite=Strict │
    │                                     │
    │ Body: {                             │
    │   "userId": "user_123",             │
    │   "companyId": "company_47",        │
    │   "role": "OWNER",                  │
    │   "name": "Proprietário",           │
    │   "email": "admin@..."              │
    │ }                                   │
    └─────────────────────────────────────┘
```

### 2.2 Validações Críticas

**Regra 1: Tentativas de Login Falhadas**
```
Tentativa 1: Fail → OK (pode tentar novamente)
Tentativa 2: Fail → OK
Tentativa 3: Fail → OK
Tentativa 4: Fail → OK
Tentativa 5: Fail → Bloquear por 15 minutos
Tentativa 6+: Fail → Recusar

Implementação:
- Tabela: user_login_attempts (user_id, failed_count, locked_until)
- Limpar failed_count após login bem-sucedido
- Incrementar e verificar locked_until antes de validar senha
```

**Regra 2: Validações de Status**
```typescript
async validateLogin(email: string, password: string) {
  // 1. Buscar usuário
  const user = await db.users.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  // 2. Verificar tentativas bloqueadas
  const isBlocked = await this.isUserBlocked(user.id);
  if (isBlocked) throw new TooManyRequestsException('Account locked');

  // 3. Validar senha
  const isPasswordValid = await argon2.verify(user.passwordHash, password);
  if (!isPasswordValid) {
    await this.recordFailedAttempt(user.id); // Incrementar tentativas
    throw new UnauthorizedException('Invalid credentials');
  }

  // 4. Verificar status do usuário
  if (user.status === 'DISABLED') throw new UnauthorizedException('User disabled');
  if (user.status === 'DELETED') throw new UnauthorizedException('User not found');
  if (user.status === 'TEMPORARILY_BLOCKED') throw new UnauthorizedException('User blocked');

  // 5. Verificar status da empresa
  const company = await db.companies.findUnique({ where: { id: user.companyId } });
  if (!company) throw new UnauthorizedException('Company not found');
  
  if (company.status === 'CANCELLED') 
    throw new UnauthorizedException('Company cancelled');
  
  if (company.status === 'SUSPENDED') 
    throw new UnauthorizedException('Company suspended');

  // PENDING_SETUP: Permitir, mas redirecionar para onboarding
  // OVERDUE: Permitir, mas exibir aviso

  // 6. Limpar tentativas falhas
  await this.clearFailedAttempts(user.id);

  return user;
}
```

---

## 3. Tokens JWT

### 3.1 Access Token

**Duração**: 15 minutos  
**Transporte**: Cookie HttpOnly ou Header Authorization  
**Renovação**: Via refresh token

**Payload**:
```json
{
  "sub": "user_123",              // User ID (subject)
  "userId": "user_123",           // User ID (redundante para facilidade)
  "companyId": "company_47",      // Company ID (CRÍTICO)
  "role": "OWNER",                // Role (para decisões rápidas)
  "email": "user@company.com",    // Email (informativo)
  "iat": 1722370800,              // Issued at
  "exp": 1722371700,              // Expires (15 min depois)
  "type": "access"                // Tipo de token
}
```

**Assinatura**:
- Algoritmo: RS256 (RSA Signature with SHA-256)
- Chave Privada: Armazenada em `/etc/secrets/jwt-private.key`
- Chave Pública: Enviada para clientes ou publicada em `/.well-known/jwks.json`

### 3.2 Refresh Token

**Duração**: 7 dias  
**Rotativo**: Sim (cada uso gera um novo)  
**Armazenamento**: Hash no banco de dados

**Processo**:

```
1. Gerar token aleatório (32 bytes)
   refresh_token = randomBytes(32).toString('hex')

2. Hash do token (Argon2id com salt)
   hash = argon2.hash(refresh_token)

3. Armazenar no banco
   UserSession {
     id: UUID,
     userId: 'user_123',
     companyId: 'company_47',
     refreshTokenHash: 'hash_do_token',
     expiresAt: now() + 7 days,
     issuedAt: now(),
     userAgent: 'Mozilla/5.0...',
     ipAddress: '192.168.1.1',
     revokedAt: null,
     status: 'ACTIVE'
   }

4. Retornar token ao cliente
   Cookie: refresh_token=<token_aleatorio_original>
   
5. Cliente armazena em cookie HttpOnly

6. Ao renovar (próximo refresh):
   - Cliente envia refresh_token em cookie
   - Servidor faz hash do token recebido
   - Compara com hash no banco
   - Se igual: valida sessão
   - Gera novo refresh_token
   - Atualiza banco com novo hash
   - Retorna novo refresh_token ao cliente
```

**Validações**:
- Hash do token corresponde ao armazenado
- Sessão não foi revogada (`revokedAt IS NULL`)
- Sessão não expirou (`expiresAt > NOW()`)
- Mesma empresa (`companyId` bate)

---

## 4. Senhas

### 4.1 Armazenamento

**Algoritmo**: Argon2id (OWASP recomendado para 2024+)

```typescript
import * as argon2 from 'argon2';

// Hashing de senha no cadastro/alteração
async hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,     // 64 MB
    timeCost: 3,           // 3 iterations
    parallelism: 4,        // 4 threads
    raw: false,            // Retornar hash formatado
  });
}

// Verificação no login
async verifyPassword(password: string, hash: string): Promise<boolean> {
  return await argon2.verify(hash, password);
}
```

**Configurações**:
- Memory: 64 MB
- Time: 3 iterations
- Parallelism: 4
- Resultado: Hash seguro (~100ms para verificar)

### 4.2 Validação de Força

**Requisitos mínimos**:
- Mínimo 12 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 símbolo (!@#$%^&*)

**Implementação**:
```typescript
const passwordSchema = z.string()
  .min(12, 'Mínimo 12 caracteres')
  .regex(/[A-Z]/, 'Precisa de letra maiúscula')
  .regex(/[a-z]/, 'Precisa de letra minúscula')
  .regex(/[0-9]/, 'Precisa de número')
  .regex(/[!@#$%^&*]/, 'Precisa de símbolo');
```

### 4.3 Histórico (Fase 2 Avançada)

Prevenir reutilização das últimas 3 senhas:

```typescript
// Tabela: user_password_history
interface UserPasswordHistory {
  id: UUID;
  userId: UUID;
  passwordHash: STRING;     // Hash da senha antiga
  changedAt: TIMESTAMP;
}

// Ao alterar senha
async changePassword(userId: string, newPassword: string) {
  // 1. Verificar últimas 3 senhas
  const lastThree = await db.userPasswordHistory.findMany({
    where: { userId },
    orderBy: { changedAt: 'desc' },
    take: 3,
  });

  for (const entry of lastThree) {
    if (await argon2.verify(entry.passwordHash, newPassword)) {
      throw new BadRequestException('Cannot reuse recent passwords');
    }
  }

  // 2. Hash da nova senha
  const newHash = await this.hashPassword(newPassword);

  // 3. Transação: update user + insert history
  await db.$transaction([
    db.users.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    }),
    db.userPasswordHistory.create({
      data: {
        userId,
        passwordHash: newHash,
        changedAt: new Date(),
      },
    }),
  ]);
}
```

---

## 5. Recuperação de Senha

### 5.1 Fluxo

```
1. Usuário clica "Esqueci a senha"
   POST /auth/password-reset
   { "email": "user@company.com" }

2. Sistema valida email
   - Email existe?
   - Usuário ativo?
   - Empresa ativa?

3. Gerar token de recuperação
   - Token aleatório (20 caracteres)
   - Hash do token (Argon2id)
   - Armazenar com expiração (1 hora)

4. Enviar email com link
   Link: /auth/reset/<token_original>

5. Usuário clica link
   GET /auth/reset/<token>
   - Validar token
   - Mostrar formulário de nova senha

6. Usuário submete nova senha
   POST /auth/reset/<token>
   {
     "newPassword": "nova_senha_forte"
   }

7. Validar e atualizar
   - Token ainda válido?
   - Senha válida?
   - Usuário ativo?
   - Atualizar passwordHash
   - Marcar token como usado
   - Revogar todas as sessões

8. Redirecionar para login
```

### 5.2 Implementação

```typescript
// Tabela: password_reset_tokens
interface PasswordResetToken {
  id: UUID;
  userId: UUID;
  tokenHash: STRING;       // Hash do token
  expiresAt: TIMESTAMP;    // 1 hora
  usedAt?: TIMESTAMP;      // Marcado após uso
  createdAt: TIMESTAMP;
}

// Requisitar reset
async requestPasswordReset(email: string) {
  const user = await db.users.findUnique({ where: { email } });
  if (!user) {
    // Não revelar se email existe (proteção contra enumeração)
    return { message: 'Se email existe, enviaremos um link' };
  }

  // Validar usuário
  if (user.status !== 'ACTIVE') return;
  
  // Validar empresa
  const company = await db.companies.findUnique({ where: { id: user.companyId } });
  if (company.status === 'SUSPENDED' || company.status === 'CANCELLED') return;

  // Gerar token
  const token = crypto.randomBytes(20).toString('hex');
  const tokenHash = await argon2.hash(token);

  // Armazenar
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
    },
  });

  // Enviar email
  await this.emailService.sendPasswordResetEmail(user.email, token);
}

// Confirmar reset
async confirmPasswordReset(token: string, newPassword: string) {
  // 1. Validar token
  const resetRecord = await db.passwordResetToken.findFirst({
    where: {
      expiresAt: { gt: new Date() },
      usedAt: null,
    },
  });

  if (!resetRecord) throw new BadRequestException('Invalid or expired token');

  // 2. Verificar hash do token
  const isValid = await argon2.verify(resetRecord.tokenHash, token);
  if (!isValid) throw new BadRequestException('Invalid token');

  // 3. Validar senha
  await this.validatePassword(newPassword);

  // 4. Hash da nova senha
  const newHash = await this.hashPassword(newPassword);

  // 5. Transação: atualizar usuário, marcar token, revogar sessões
  await db.$transaction([
    db.users.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: newHash },
    }),
    db.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
    db.userSessions.updateMany({
      where: { userId: resetRecord.userId },
      data: { revokedAt: new Date() },
    }),
  ]);

  return { message: 'Senha alterada com sucesso' };
}
```

---

## 6. Cookies Seguros

### 6.1 Configuração

```typescript
// config/cookie.config.ts
export const cookieConfig = {
  accessToken: {
    name: 'access_token',
    options: {
      httpOnly: true,       // ✅ Inacessível por JavaScript
      secure: true,         // ✅ HTTPS apenas
      sameSite: 'strict',   // ✅ Não enviado cross-domain
      maxAge: 15 * 60 * 1000, // 15 minutos
      path: '/',
    },
  },
  refreshToken: {
    name: 'refresh_token',
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      path: '/api/auth/refresh', // Restringir ao endpoint de refresh
    },
  },
};
```

### 6.2 Setando Cookies na Resposta

```typescript
@Post('/login')
async login(@Body() dto: LoginDto, @Res() res: Response) {
  const { user, accessToken, refreshToken } = await this.auth.login(dto);

  // Access token
  res.cookie(
    cookieConfig.accessToken.name,
    accessToken,
    cookieConfig.accessToken.options,
  );

  // Refresh token
  res.cookie(
    cookieConfig.refreshToken.name,
    refreshToken,
    cookieConfig.refreshToken.options,
  );

  // Responder com dados do usuário
  return res.json({
    userId: user.id,
    companyId: user.companyId,
    role: user.role,
    email: user.email,
  });
}
```

---

## 7. Logout

### 7.1 Logout Simples

```typescript
@Post('/logout')
@UseGuards(AuthGuard('jwt'))
async logout(@Req() req: Request, @Res() res: Response) {
  const userId = req.user.userId;
  const sessionId = req.user.sessionId; // Pode vir do JWT se armazenar

  // Revogar apenas esta sessão
  await db.userSessions.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });

  // Limpar cookies
  res.clearCookie(cookieConfig.accessToken.name);
  res.clearCookie(cookieConfig.refreshToken.name);

  return res.json({ message: 'Logged out' });
}
```

### 7.2 Logout de Todos os Dispositivos

```typescript
@Post('/logout-all')
@UseGuards(AuthGuard('jwt'))
async logoutAll(@Req() req: Request, @Res() res: Response) {
  const userId = req.user.userId;

  // Revogar TODAS as sessões do usuário
  await db.userSessions.updateMany({
    where: { userId },
    data: { revokedAt: new Date() },
  });

  res.clearCookie(cookieConfig.accessToken.name);
  res.clearCookie(cookieConfig.refreshToken.name);

  return res.json({ message: 'Logged out from all devices' });
}
```

---

## 8. Primeira Acesso (First Login)

### 8.1 Fluxo

```
1. Admin cria usuário
   POST /users (admin)
   {
     "email": "novo@company.com",
     "name": "Novo Usuário",
     "role": "ATTENDANT"
   }

2. Sistema gera senha temporária
   - Aleatória (16 caracteres)
   - Válida por 1 acesso

3. Admin compartilha senha (WhatsApp, email, pessoalmente)

4. Usuário tenta fazer login
   POST /auth/login
   {
     "email": "novo@company.com",
     "password": "senha_temporaria_123ABC"
   }

5. Sistema detecta primeiro acesso
   if (user.isFirstLogin && user.passwordExpiresAt < now()) {
     return { code: 'FIRST_LOGIN_REQUIRED' };
   }

6. Frontend redireciona para /onboarding/password

7. Usuário cria nova senha
   POST /auth/set-password
   {
     "currentPassword": "senha_temporaria_123ABC",
     "newPassword": "minha_senha_forte"
   }

8. Sistema atualiza
   - passwordHash com nova senha
   - isFirstLogin = false
   - passwordExpiresAt = null
   - Revogar sessão anterior (forçar novo login)

9. Usuário redireciona para login
```

### 8.2 Implementação

```typescript
// Gerar usuário com senha temporária
async createUser(companyId: string, dto: CreateUserDto) {
  // Gerar senha temporária
  const tempPassword = this.generateTemporaryPassword(16);
  const passwordHash = await this.hashPassword(tempPassword);

  const user = await db.users.create({
    data: {
      ...dto,
      companyId,
      passwordHash,
      isFirstLogin: true,
      passwordExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      status: 'PENDING_FIRST_LOGIN',
    },
  });

  // Retornar senha temporária (somente neste momento)
  return {
    userId: user.id,
    temporaryPassword: tempPassword,
    message: 'Compartilhe esta senha com o usuário',
  };
}

// Validar no login
async login(email: string, password: string) {
  const user = await this.validateLogin(email, password);

  if (user.isFirstLogin) {
    return {
      code: 'FIRST_LOGIN_REQUIRED',
      message: 'Você precisa criar uma nova senha',
      userId: user.id,
    };
  }

  // Fluxo normal...
}

// Confirmar primeira senha
async setInitialPassword(userId: string, newPassword: string) {
  const user = await db.users.findUnique({ where: { id: userId } });

  if (!user.isFirstLogin) {
    throw new BadRequestException('Usuário não está no primeiro login');
  }

  // Validar nova senha
  await this.validatePassword(newPassword);

  // Atualizar
  await db.users.update({
    where: { id: userId },
    data: {
      passwordHash: await this.hashPassword(newPassword),
      isFirstLogin: false,
      passwordExpiresAt: null,
      status: 'ACTIVE',
    },
  });

  // Revogar sessão anterior
  await db.userSessions.updateMany({
    where: { userId },
    data: { revokedAt: new Date() },
  });

  return { message: 'Senha criada com sucesso. Faça login novamente' };
}
```

---

## 9. Administradores da Plataforma

### 9.1 Estrutura Separada

Administradores têm suas próprias tabelas:

```typescript
// Tabela: platform_admins
interface PlatformAdmin {
  id: UUID;
  email: STRING; // unique
  passwordHash: STRING;
  name: STRING;
  role: ENUM('SUPER_ADMIN', 'SUPPORT');
  status: ENUM('ACTIVE', 'DISABLED');
  createdAt: TIMESTAMP;
  updatedAt: TIMESTAMP;
}

// Tabela: platform_admin_sessions (mesma estrutura que UserSession)
interface PlatformAdminSession {
  id: UUID;
  platformAdminId: UUID;
  refreshTokenHash: STRING;
  expiresAt: TIMESTAMP;
  issuedAt: TIMESTAMP;
  userAgent: TEXT;
  ipAddress: INET;
  revokedAt?: TIMESTAMP;
  status: ENUM('ACTIVE', 'REVOKED', 'EXPIRED');
}
```

### 9.2 Diferenças

| Aspecto | Usuário Cliente | Admin Plataforma |
|---------|-----------------|------------------|
| Login | `app.seudominio.com` | `admin.seudominio.com` |
| Tabela | `users` | `platform_admins` |
| Sessão | `user_sessions` | `platform_admin_sessions` |
| companyId | Sempre preenchido | Nunca preenchido |
| Role | OWNER, MANAGER, etc | SUPER_ADMIN, SUPPORT |
| Acesso | Dados próprios | Dados plataforma + modo suporte |

---

## 10. Checklist de Segurança

- ✅ Senhas com Argon2id (não MD5, SHA1, bcrypt)
- ✅ Refresh token rotativo
- ✅ Refresh token armazenado com hash
- ✅ Cookies HttpOnly, Secure, SameSite
- ✅ Access token com duração curta (15 min)
- ✅ Refresh token com duração longa (7 dias)
- ✅ Rate limiting em login (5 tentativas / 15 min)
- ✅ Bloqueio temporário (15 min) após limite
- ✅ Recuperação de senha segura (token de 1 hora)
- ✅ Primeiro acesso força criação de senha
- ✅ Logout revoga sessão
- ✅ Logout de todos os dispositivos
- ✅ Email não revela existência de usuário
- ✅ Testes de security (brute force, token tampering)
- ✅ Audit log de logins/logouts
- ✅ Admin não pode ler senha do cliente

---

Fim do documento de autenticação.
