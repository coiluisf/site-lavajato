# Fase 5: Pages & Integration — Design Specification

**Date:** 2026-07-30  
**Status:** Design Review  
**Scope:** Frontend CRUD pages, Context API state management, Dashboard real data integration

---

## 1. Overview

Fase 5 implementa as 4 páginas de CRUD frontend (Clientes, Serviços, Agendamentos, Financeiro) para complementar o backend Fase 4. Usa React Context API para gerenciamento de estado, custom hooks para fetch/cache de dados, e formulários em modal para operações de criação/edição. Dashboard é conectado ao backend para mostrar dados reais.

**Success Criteria:**
- ✅ Usuários conseguem criar, listar, editar e deletar: clientes, serviços, agendamentos, pedidos
- ✅ Dashboard mostra dados reais de faturamento, agendamentos e ocupação
- ✅ Busca funciona em listagens de clientes e serviços
- ✅ Paginação básica em todas as listagens (20 itens/página)
- ✅ Validação frontend com Zod (espelhando backend)
- ✅ Feedback ao usuário via toast (sucesso/erro)

---

## 2. Architecture: State Management

### 2.1 Context Structure

**CompanyContext** (`context/CompanyContext.tsx`)
- Armazena companyId, userId, userRole
- Fornecido no root layout (após login)
- Consumido por todos os custom hooks

```tsx
type CompanyContextType = {
  companyId: number;
  userId: number;
  userRole: 'admin' | 'gerente' | 'lavador' | 'atendente';
  setCompanyId: (id: number) => void;
};
```

### 2.2 Custom Hooks Pattern

Cada domínio (customers, services, etc) tem um hook que:
1. Consome `CompanyContext` para obter `companyId`
2. Chama funções do `api/client.ts`
3. Gerencia estado: `data`, `loading`, `error`
4. Fornece ações: `fetch()`, `create()`, `update()`, `delete()`, `search()`

**Exemplo: `useCustomers()`**
```tsx
export function useCustomers() {
  const { companyId } = useContext(CompanyContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetchCustomers(companyId, page, 20);
      setCustomers(data.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [companyId, page]);

  const create = useCallback(async (dto: CreateCustomerDto) => {
    try {
      const data = await apiClient.createCustomer(companyId, dto);
      setCustomers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, [companyId]);

  const update = useCallback(async (id: number, dto: UpdateCustomerDto) => {
    try {
      const data = await apiClient.updateCustomer(companyId, id, dto);
      setCustomers(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, [companyId]);

  const deleteCustomer = useCallback(async (id: number) => {
    try {
      await apiClient.deleteCustomer(companyId, id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, [companyId]);

  const search = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const data = await apiClient.searchCustomers(companyId, query);
      setCustomers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  return {
    customers,
    loading,
    error,
    fetch,
    create,
    update,
    delete: deleteCustomer,
    search,
    page,
    setPage,
  };
}
```

**Hooks necessários:**
- `useCustomers()` — Customers CRUD + search
- `useServices()` — Services CRUD
- `useAppointments()` — Appointments CRUD + status update + today filter
- `useOrders()` — Orders CRUD + revenue endpoint
- `useCompanyStats()` — Dashboard stats (KPIs)

### 2.3 API Client (`api/client.ts`)

Wrapper tipado para chamadas HTTP com tratamento de erro:

```tsx
export const apiClient = {
  // Customers
  fetchCustomers: (companyId: number, page: number, limit: number) =>
    fetch(`/api/companies/${companyId}/customers?page=${page}&limit=${limit}`).then(r => r.json()),
  
  createCustomer: (companyId: number, dto: unknown) =>
    fetch(`/api/companies/${companyId}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(r => r.json()),

  searchCustomers: (companyId: number, query: string) =>
    fetch(`/api/companies/${companyId}/customers/search?q=${query}`).then(r => r.json()),

  // ... similar para services, appointments, orders
};
```

---

## 3. Pages & Components

### 3.1 Layout: Dashboard Tab Navigation

**File:** `app/dashboard/layout.tsx`

- Header com logo NitroWash
- Navigation com 4 abas: Dashboard, Clientes, Serviços, Agendamentos, Financeiro
- Logout button
- Ativa abas baseado em rota atual via `usePathname()`

**Estados:**
- Ativa = accent color underline
- Hover = subtle background

### 3.2 Page: Customers (`app/dashboard/customers/page.tsx`)

**Componentes:**
- `CustomersList.tsx` — Tabela principal
- `CustomerModal.tsx` — Form create/edit
- `CustomerSearch.tsx` — Barra de busca

**Fluxo:**
```
Page monta → useCustomers().fetch() → CustomersList renderiza
User clica "+ Novo" → CustomerModal abre vazio
User preenche + clica "Salvar" → useCustomers().create(dto)
  → Toast success → Modal fecha → Lista atualiza
User clica ✏️ → CustomerModal abre preenchido
User edita + clica "Salvar" → useCustomers().update(id, dto)
  → Toast success → Modal fecha → Lista atualiza
User clica 🗑 → Confirma → useCustomers().delete(id)
  → Toast success → Lista atualiza
User digita busca → useCustomers().search(query)
  → Lista filtra em tempo real
```

**Estados:**
- Carregando: Skeleton rows
- Vazio: "Nenhum cliente cadastrado"
- Erro: Toast com mensagem de erro
- Sucesso: Toast com mensagem de sucesso

### 3.3 Page: Services (`app/dashboard/services/page.tsx`)

Mesmo padrão que Customers, mas com campos: Nome, Descrição, Duração (min), Preço (R$).

### 3.4 Page: Appointments (`app/dashboard/appointments/page.tsx`)

**Adições:**
- Filtro por status (Agendado, Em Curso, Completo, Cancelado)
- Mudança de status via dropdown na tabela
- Campos no form: Veículo (select), Serviço (select), Data/Hora, Funcionário (optional), Notas
- Validação: data deve ser >= hoje

**Fluxo de Status:**
```
Agendado → (clica "Em Curso") → Em Andamento
Em Andamento → (clica "Completo") → Completo
Qualquer status → (clica "Cancelar") → Cancelado
```

### 3.5 Page: Financial (`app/dashboard/financial/page.tsx`)

**Componentes:**
- `FinancialSummary.tsx` — Cards com KPIs (total, pedidos, ticket médio)
- `RevenueChart.tsx` — Gráfico barras últimos 7 dias (Recharts)
- `RecentOrders.tsx` — Tabela últimos 10 pedidos

**Fluxo:**
```
Page monta → useOrders().revenue(30) → mostra total
           → useOrders().fetch(status=completed) → mostra gráfico + tabela
User clica "Período" dropdown → muda dias (7, 30, 90)
  → re-fetch revenue com novo período
```

**Dados:**
- `FinancialSummary`: Total (R$), Pedidos Completos (qty), Ticket Médio (R$)
- `RevenueChart`: 7 barras (últimos 7 dias), altura proporcional a faturamento
- `RecentOrders`: Tabela com Data, Cliente, Valor, Status

### 3.6 Dashboard (Conectado) (`app/dashboard/page.tsx`)

**Mudanças:**
Remove mock data, carrega dados reais via `useCompanyStats()`:

```tsx
const { stats, loading } = useCompanyStats();

// KPIs:
- "Lavagens Hoje": appointments filter today + status in_progress/completed
- "Faturamento": orders today + status completed + sum totalPrice
- "Agendamentos": appointments filter future
- "Taxa de Ocupação": ???? (precisa lógica de capacidade)
```

**Nota:** Taxa de Ocupação depende de configuração de "capacidade máxima de lavações/dia". Por enquanto, pode ser:
- Fixo (ex: 92%)
- Ou: (agendamentos de hoje / 20) * 100

---

## 4. Reusable Components

### 4.1 DataTable Component

```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Nome', width: '30%' },
    { key: 'phone', label: 'Telefone', width: '20%' },
    { key: 'city', label: 'Cidade', width: '20%' },
  ]}
  data={customers}
  loading={loading}
  onEdit={(item) => openModal(item)}
  onDelete={(id) => deleteCustomer(id)}
  pagination={{ page, setPage, total, limit: 20 }}
/>
```

**Features:**
- Skeleton loading state
- Hoverable rows
- Action buttons (edit, delete)
- Pagination controls

### 4.2 CrudModal Component

```tsx
<CrudModal
  title={editingId ? 'Editar Cliente' : 'Novo Cliente'}
  fields={[
    { name: 'name', label: 'Nome', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Telefone', type: 'tel', required: true },
  ]}
  initialData={editingData}
  onSubmit={handleSubmit}
  loading={loading}
  onClose={closeModal}
/>
```

**Features:**
- Auto-generates form from field definitions
- Zod validation
- Submit/Cancel buttons
- Loading state on submit

### 4.3 Toast Component

```tsx
<Toast
  type="success" // success | error | info
  message="Cliente criado com sucesso!"
  duration={3000}
/>
```

---

## 5. Validation Strategy

**Frontend Validation:** Zod DTOs (mesmos do backend)

```tsx
// Shared DTOs (apps/web/src/types/dto.ts)
export const CustomerSchema = z.object({
  name: z.string().min(3).max(255),
  document: z.string().regex(/^\d{11,14}$/, 'CPF ou CNPJ inválido'),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  // ...
});
```

**Backend Validation:** Já implementado (Fase 4)

**Flow:**
1. User preenche form
2. Frontend valida com Zod → mostra erro inline se inválido
3. Se válido, envia para API
4. Backend valida novamente
5. Se erro, frontend mostra toast com mensagem do backend
6. Se sucesso, atualiza estado local + fecha modal + toast success

---

## 6. Routing & Navigation

```
/login → LoginPage (já existe)
/password-reset → PasswordResetPage (já existe)
/dashboard → DashboardLayout (TAB NAVIGATION)
  ├─ /dashboard (tab "Dashboard") → Dashboard.tsx
  ├─ /dashboard/customers → Customers/page.tsx
  ├─ /dashboard/services → Services/page.tsx
  ├─ /dashboard/appointments → Appointments/page.tsx
  └─ /dashboard/financial → Financial/page.tsx
```

**Auth Guard:**
- Middleware redireciona `/` → `/login` se não autenticado
- Checks localStorage para `accessToken`
- Se expirado, tenta refresh via `/auth/refresh` endpoint

---

## 7. File Structure

```
apps/web/src/
├─ app/
│  ├─ layout.tsx (root layout)
│  ├─ page.tsx (redireciona para /login ou /dashboard)
│  ├─ login/
│  │  └─ page.tsx (LoginPage)
│  ├─ password-reset/
│  │  └─ page.tsx (PasswordResetPage)
│  └─ dashboard/
│     ├─ layout.tsx (DashboardLayout com tabs)
│     ├─ page.tsx (Dashboard overview)
│     ├─ customers/
│     │  └─ page.tsx
│     ├─ services/
│     │  └─ page.tsx
│     ├─ appointments/
│     │  └─ page.tsx
│     └─ financial/
│        └─ page.tsx
├─ components/
│  ├─ Dashboard/
│  │  ├─ Dashboard.tsx
│  │  ├─ KPICard.tsx
│  │  ├─ WeeklyRevenueChart.tsx
│  │  ├─ LowStockAlert.tsx
│  │  └─ WashingQueueTable.tsx
│  ├─ Customers/
│  │  ├─ CustomersList.tsx
│  │  ├─ CustomerModal.tsx
│  │  └─ CustomerSearch.tsx
│  ├─ Services/
│  │  ├─ ServicesList.tsx
│  │  └─ ServiceModal.tsx
│  ├─ Appointments/
│  │  ├─ AppointmentsList.tsx
│  │  ├─ AppointmentModal.tsx
│  │  └─ StatusBadge.tsx
│  ├─ Financial/
│  │  ├─ FinancialSummary.tsx
│  │  ├─ RevenueChart.tsx
│  │  └─ RecentOrders.tsx
│  ├─ Common/
│  │  ├─ DataTable.tsx
│  │  ├─ CrudModal.tsx
│  │  ├─ Toast.tsx
│  │  ├─ Skeleton.tsx
│  │  └─ Pagination.tsx
│  └─ Auth/
│     ├─ LoginPage.tsx (já existe)
│     └─ PasswordResetPage.tsx (já existe)
├─ context/
│  ├─ CompanyContext.tsx
│  └─ AuthContext.tsx (create if needed)
├─ hooks/
│  ├─ useCustomers.ts
│  ├─ useServices.ts
│  ├─ useAppointments.ts
│  ├─ useOrders.ts
│  └─ useCompanyStats.ts
├─ api/
│  └─ client.ts
├─ types/
│  ├─ dto.ts (Zod schemas)
│  └─ index.ts
└─ styles/
   └─ design-system.css (já existe, adicionar estilos de loading, modal)
```

---

## 8. Error Handling & User Feedback

**Toast Messages:**
- Success: "Cliente criado com sucesso!"
- Error: "Erro ao criar cliente: {message}"
- Loading: (Skeleton states, disabled buttons)

**API Error Handling:**
```tsx
catch (error) {
  const message = error.response?.data?.message || 'Erro desconhecido';
  showToast('error', message);
  setError(message);
}
```

**Network Issues:**
- Retry button on error state
- Offline detection (navigator.onLine)
- Graceful degradation

---

## 9. Performance Considerations

**Otimizações:**
- Lazy load pages (next/dynamic)
- Memoize Components (React.memo para DataTable, CrudModal)
- Pagination (20 itens/page, não carregar tudo)
- Debounce search (300ms delay)
- Cache Context data (não refetch em cada mount)

**Future (Fase 6):**
- SWR/React Query para invalidação automática
- Infinite scroll em listagens
- Real-time updates (WebSocket)

---

## 10. Testing Strategy

**Unit Tests:**
- Hooks (useCustomers, etc)
- Components (DataTable, CrudModal)
- API client error handling

**Integration Tests:**
- Full CRUD flows (create → update → delete)
- Search functionality
- Modal open/close

**E2E Tests (Cypress):**
- Create customer → Edit → Delete
- Search customer
- Create appointment with conflict detection
- View financial dashboard

---

## 11. Acceptance Criteria

- [ ] CompanyContext fornecido em root layout
- [ ] useCustomers, useServices, useAppointments, useOrders, useCompanyStats implementados
- [ ] api/client.ts com tipagem completa
- [ ] DashboardLayout com tab navigation funcional
- [ ] Customers page: CRUD + search + paginação
- [ ] Services page: CRUD + paginação
- [ ] Appointments page: CRUD + status update + filtros
- [ ] Financial page: KPIs + gráfico + tabela
- [ ] DataTable component reutilizável
- [ ] CrudModal component reutilizável
- [ ] Toast feedback em todas as operações
- [ ] Validação Zod frontend
- [ ] Auth guard protegendo /dashboard
- [ ] Dashboard com dados reais (stats, revenue, appointments)
- [ ] Todos os testes passando

---

## 12. Dependencies

**Novos pacotes necessários:**
- `recharts` (gráficos) — já instalado? Check package.json
- `zustand` ou `context-api` (state) — context-api é nativo, usar isso
- Nenhum novo package HTTP (usar fetch nativo)

---

## 13. Timeline & Phases

**Fase 5a:** Setup (Context, Hooks, API Client) — ~4h  
**Fase 5b:** Customers & Services pages — ~6h  
**Fase 5c:** Appointments & Financial pages — ~6h  
**Fase 5d:** Polish (error handling, tests, docs) — ~4h  

**Total: ~20h**

---

## Scope: What's NOT in Fase 5

- ❌ Real-time updates (WebSocket) → Fase 6
- ❌ Email notifications → Fase 6
- ❌ Advanced reporting/exports → Fase 6
- ❌ Mobile optimization → Fase 6
- ❌ Dark mode → Fase 6
