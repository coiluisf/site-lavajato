# Estratégia Multi-Tenant e Isolamento de Dados

**Status**: Fase 0 — Análise  
**Data**: 2026-07-30

---

## 1. Modelo de Isolamento

### 1.1 Tipo: Row-Level Tenancy

Cada registro de negócio pertence a uma empresa específica.

**Regra de Ouro**: 
> Nenhuma query do banco será executada sem validação do `companyId` extraído da sessão autenticada do usuário.

**Arquitetura de Isolamento**:

```
┌─────────────────────────────────────────┐
│ Requisição HTTP                         │
│ Authorization: Bearer JWT               │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ AuthGuard                               │
│ - Valida JWT                            │
│ - Extrai userId, companyId, role        │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ TenantGuard                             │
│ - Valida companyId do contexto          │
│ - Injeta em RequestContext              │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ Service                                 │
│ - Usa companyId do RequestContext       │
│ - Adiciona WHERE company_id = $value    │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ Prisma Query                            │
│ - Busca apenas dados de uma empresa     │
│ - Garante isolamento                    │
└─────────────────────────────────────────┘
```

---

## 2. Implementação Técnica

### 2.1 Contexto de Tenant por Requisição

```typescript
// common/decorators/get-tenant-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetTenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.companyId; // Extraído do JWT
  },
);

// Uso:
@Get('/service-orders')
async getServiceOrders(@GetTenantId() companyId: string) {
  return this.orderService.findByCompany(companyId);
}
```

### 2.2 Guard de Tenant

```typescript
// common/guards/tenant.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Validar que usuário está autenticado
    if (!request.user || !request.user.companyId) {
      throw new UnauthorizedException('Invalid tenant context');
    }

    // Validar que companyId é um UUID válido
    if (!this.isValidUUID(request.user.companyId)) {
      throw new UnauthorizedException('Invalid company ID');
    }

    // Injetar companyId no request para usar em services
    request.tenantId = request.user.companyId;

    return true;
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

// Aplicar globalmente no main.ts:
// app.useGlobalGuards(new TenantGuard());
```

### 2.3 Service Tenant-Aware

```typescript
// modules/service-orders/service-orders.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class ServiceOrdersService {
  constructor(private prisma: PrismaService) {}

  // Sempre receber companyId como parâmetro
  async findByCompany(companyId: string) {
    return this.prisma.serviceOrder.findMany({
      where: {
        companyId, // Validação explícita
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Buscar um registro específico
  async findOne(id: string, companyId: string) {
    const order = await this.prisma.serviceOrder.findUnique({
      where: { id },
    });

    // Validar que pertence à empresa correta
    if (!order || order.companyId !== companyId) {
      throw new NotFoundException('Service order not found');
    }

    return order;
  }

  // Criar um registro
  async create(companyId: string, data: CreateServiceOrderDto) {
    return this.prisma.serviceOrder.create({
      data: {
        ...data,
        companyId, // Forçar companyId da sessão
      },
    });
  }

  // Atualizar um registro
  async update(id: string, companyId: string, data: UpdateServiceOrderDto) {
    const existing = await this.findOne(id, companyId);

    return this.prisma.serviceOrder.update({
      where: { id },
      data,
    });
  }

  // Deletar (soft delete quando apropriado)
  async delete(id: string, companyId: string) {
    await this.findOne(id, companyId);

    return this.prisma.serviceOrder.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
```

### 2.4 Controller com Guards

```typescript
// modules/service-orders/service-orders.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TenantGuard } from '@/common/guards/tenant.guard';
import { GetTenantId } from '@/common/decorators/get-tenant-id.decorator';
import { ServiceOrdersService } from './service-orders.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';

@Controller('service-orders')
@UseGuards(AuthGuard('jwt'), TenantGuard)
export class ServiceOrdersController {
  constructor(private readonly service: ServiceOrdersService) {}

  @Get()
  async findAll(@GetTenantId() companyId: string) {
    return this.service.findByCompany(companyId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetTenantId() companyId: string,
  ) {
    return this.service.findOne(id, companyId);
  }

  @Post()
  async create(
    @Body() dto: CreateServiceOrderDto,
    @GetTenantId() companyId: string,
  ) {
    return this.service.create(companyId, dto);
  }
}
```

### 2.5 Validação de Propriedade

Sempre validar que um registro pertence à empresa antes de modificar:

```typescript
// Anti-padrão (INSEGURO):
const order = await this.prisma.serviceOrder.findUnique({ where: { id } });
if (order) {
  await this.prisma.serviceOrder.update({...}); // ❌ Perigo!
}

// Padrão correto (SEGURO):
const order = await this.prisma.serviceOrder.findUnique({ 
  where: { id },
});

// Validar propriedade
if (!order || order.companyId !== companyId) {
  throw new NotFoundException('Not found');
}

await this.prisma.serviceOrder.update({...}); // ✅ Seguro
```

---

## 3. Estrutura de Banco de Dados

### 3.1 Modelo Conceitual

```
┌──────────────────┐
│   companies      │
│  ─────────────   │
│  id (PK, UUID)   │
│  name            │
│  status          │
└────────┬─────────┘
         │ 1:N
         │
┌────────▼──────────────────────────┐
│   Entidades Isoladas              │
│   (customers, vehicles, orders)   │
│  ─────────────────────────────    │
│  id (PK, UUID)                    │
│  company_id (FK, NOT NULL) ◄──┐   │
│  name                        │   │
│  ...                         │   │
│                              │   │
│  UNIQUE(company_id, field)   │   │
│  INDEX(company_id)           │   │
│  INDEX(company_id, status)   │   │
└──────────────────────────────┘   │
                                   │
                    Validação em cada query
```

### 3.2 Exemplo: Tabela `service_orders`

```sql
CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  order_number INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  total_price DECIMAL(10, 2),
  
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  
  -- Constraints
  CONSTRAINT fk_customer_company 
    CHECK (customer_id IN (
      SELECT id FROM customers WHERE company_id = service_orders.company_id
    )),
  CONSTRAINT fk_vehicle_company 
    CHECK (vehicle_id IN (
      SELECT id FROM vehicles WHERE company_id = service_orders.company_id
    )),
  CONSTRAINT unique_order_number UNIQUE(company_id, order_number),
  CONSTRAINT valid_status 
    CHECK (status IN ('DRAFT', 'WAITING', 'IN_PREPARATION', 'IN_SERVICE', 
                      'QUALITY_CHECK', 'READY', 'DELIVERED', 'CANCELLED'))
);

-- Índices críticos
CREATE INDEX idx_service_orders_company_id 
  ON service_orders(company_id);
  
CREATE INDEX idx_service_orders_company_status 
  ON service_orders(company_id, status);
  
CREATE INDEX idx_service_orders_customer_company 
  ON service_orders(customer_id, company_id);
  
CREATE INDEX idx_service_orders_created_at 
  ON service_orders(created_at DESC)
  WHERE deleted_at IS NULL;
```

---

## 4. Row-Level Security (PostgreSQL) — Defesa Adicional

### 4.1 Quando Implementar

**Recomendação**: Implementar na **Fase 2** como defesa adicional, não como única linha de defesa.

**Razão**: Adiciona complexidade ao banco mas oferece proteção contra:
- Bugs em aplicação
- Consultas SQL injetadas
- Erros de lógica

### 4.2 Implementação

```sql
-- Habilitar RLS na tabela
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- Criar política de isolamento
CREATE POLICY company_isolation ON service_orders
  AS PERMISSIVE
  FOR ALL
  USING (company_id = current_setting('app.current_company_id')::uuid);

-- Aplicar para INSERT também
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY company_isolation_insert ON service_orders
  AS PERMISSIVE
  FOR INSERT
  WITH CHECK (company_id = current_setting('app.current_company_id')::uuid);

-- Criar role para aplicação
CREATE ROLE app_user WITH LOGIN PASSWORD 'xxx';
GRANT SELECT, INSERT, UPDATE, DELETE ON service_orders TO app_user;

-- Dar permissões ao role (sem acessar tudo)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
```

### 4.3 Ativar no NestJS

```typescript
// common/prisma/prisma.middleware.ts
import { PrismaClient } from '@prisma/client';

export async function setTenantMiddleware(
  params: any,
  next: (params: any) => Promise<any>,
  companyId: string,
) {
  // Executar SET para a sessão
  await prisma.$executeRawUnsafe(
    `SET app.current_company_id = '${companyId}'`
  );
  
  return next(params);
}

// Registrar no AppModule:
// prisma.use(setTenantMiddleware);
```

---

## 5. Dados Compartilhados vs. Isolados

### 5.1 Dados Isolados (Multitenant)

Cada empresa tem sua própria cópia:

| Entidade | Motivo |
|----------|--------|
| Customers | Específicos por empresa |
| Vehicles | Específicos por empresa |
| Employees | Equipe da empresa |
| Services | Serviços oferecidos |
| Prices | Precificação própria |
| Orders | Operação diária |
| Payments | Financeiro próprio |
| Stock | Inventário próprio |
| Commissions | Folha de pagamento |
| Settings | Configurações próprias |
| Audit (empresas) | Rastreamento por empresa |

**Implementação**: Coluna `company_id` + validação em query.

### 5.2 Dados Compartilhados (Platform-wide)

Centralizados, acessados apenas por admins:

| Entidade | Motivo |
|----------|--------|
| Companies | Catálogo de empresas (admin) |
| Users | Credenciais (não isoláveis) |
| PlatformAdmins | Administradores da plataforma |
| Roles | Templates de papéis |
| Permissions | Templates de permissões |
| Audit (platform) | Auditoria centralizada |
| Licenses | Gestão de licenças |

**Implementação**: Sem `company_id`, acesso apenas por SUPER_ADMIN/SUPPORT.

---

## 6. Testes de Isolamento

### 6.1 Teste de Segurança: Vazamento de Dados

```typescript
// tests/isolation.e2e-spec.ts
describe('Multi-Tenant Isolation', () => {
  let companyA: Company;
  let companyB: Company;
  let userA: User;
  let userB: User;

  beforeAll(async () => {
    companyA = await createCompany('Company A');
    companyB = await createCompany('Company B');
    
    userA = await createUser(companyA, 'user@a.com');
    userB = await createUser(companyB, 'user@b.com');
  });

  it('should not allow userA to see companyB customers', async () => {
    // UserA cria cliente em companyA
    const customerA = await createCustomer(userA, 'João');

    // UserA tenta acessar com seu token
    const token = await login(userA);
    
    // Buscar clientes
    const response = await api
      .get('/customers')
      .set('Authorization', `Bearer ${token}`);

    expect(response.body).toContainEqual(customerA);
    expect(response.body.length).toBe(1); // Apenas o seu

    // UserB tenta com token de userB
    const tokenB = await login(userB);
    const responseB = await api
      .get('/customers')
      .set('Authorization', `Bearer ${tokenB}`);

    expect(responseB.body.length).toBe(0); // Vazio para userB
    expect(responseB.body).not.toContainEqual(customerA); // ✅ Isolado
  });

  it('should reject direct companyId parameter in query', async () => {
    const token = await login(userA);

    // Tentar passar companyId como query
    const response = await api
      .get(`/customers?companyId=${companyB.id}`)
      .set('Authorization', `Bearer ${token}`);

    // Deve ignorar ou rejeitar
    expect(response.status).not.toBe(200);
    // OU se ignorar:
    expect(response.body).toHaveLength(0);
  });

  it('should validate record ownership on update', async () => {
    // UserA cria cliente
    const customerA = await createCustomer(userA, 'João');

    // UserB obtém token
    const tokenB = await login(userB);

    // UserB tenta atualizar cliente de userA diretamente
    const response = await api
      .patch(`/customers/${customerA.id}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .send({ name: 'Hacker' });

    expect(response.status).toBe(404); // Not found for this tenant
    
    // Verificar que não foi modificado
    const updated = await getCustomer(userA, customerA.id);
    expect(updated.name).toBe('João'); // ✅ Não modificado
  });
});
```

### 6.2 Teste de Força Bruta contra Isolamento

```typescript
it('should isolate even with manipulated requests', async () => {
  const tokenA = await login(userA);
  
  // Tentar várias manipulações
  const attempts = [
    // Manipular URL
    { get: `/service-orders/${orderB.id}`, set: { Authorization: `Bearer ${tokenA}` } },
    // Tentar passar companyId em body
    { patch: `/service-orders/${orderB.id}`, send: { company_id: companyA.id } },
    // Tentar em headers
    { get: `/customers`, set: { 'X-Company-Id': companyB.id } },
  ];

  for (const attempt of attempts) {
    const response = await callApi(attempt);
    expect(response.status).toBe(404); // ✅ Sempre isolado
  }
});
```

---

## 7. Performance e Escalabilidade

### 7.1 Indexação

Cada tabela isolada deve ter índices ótimos:

```sql
-- Índice simples no companyId
CREATE INDEX idx_TABLE_company_id ON TABLE(company_id);

-- Índice composto para filtros comuns
CREATE INDEX idx_TABLE_company_status 
  ON TABLE(company_id, status);

-- Índice para ordenação
CREATE INDEX idx_TABLE_company_created 
  ON TABLE(company_id, created_at DESC);

-- Índice para buscas combinadas
CREATE INDEX idx_TABLE_company_filter 
  ON TABLE(company_id, status, created_at DESC);
```

### 7.2 Particionamento (Futuro — Fase 8+)

Se a aplicação crescer significativamente, considerar particionamento:

```sql
-- Particionar por company_id (em produção)
CREATE TABLE service_orders_partitioned (
  LIKE service_orders INCLUDING ALL
) PARTITION BY HASH (company_id);

-- Criar partições
CREATE TABLE service_orders_p0 PARTITION OF service_orders_partitioned
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
```

---

## 8. Checklist de Segurança Multi-Tenant

- ✅ Toda tabela de negócio tem `company_id`
- ✅ Nenhuma query omite `company_id` na cláusula WHERE
- ✅ Validar companyId extraído apenas do JWT
- ✅ Rejeitar companyId enviado por cliente
- ✅ Testes automatizados de isolamento
- ✅ Guard de tenant em todas as rotas protegidas
- ✅ Soft delete de registros (nunca DELETE)
- ✅ Audit log de acessos
- ✅ RLS do PostgreSQL como defesa adicional
- ✅ Índices otimizados para companyId
- ✅ Constraints de integridade referencial
- ✅ Documentação de padrões aceitos

---

Fim do documento de isolamento multi-tenant.
