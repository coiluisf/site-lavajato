'use client';

import { KPICard } from './KPICard';
import { WeeklyRevenueChart } from './WeeklyRevenueChart';
import { LowStockAlert } from './LowStockAlert';
import { WashingQueueTable } from './WashingQueueTable';
import { Navigation } from './Navigation';

export function Dashboard() {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const kpis = [
    { label: 'Lavagens Hoje', value: '24', delta: '↑ 15% vs ontem' },
    { label: 'Faturamento', value: 'R$ 2.840', delta: '↑ 8% vs ontem' },
    { label: 'Agendamentos', value: '18', delta: '→ 0% vs ontem' },
    { label: 'Taxa de Ocupação', value: '92%', delta: '↑ 5% vs ontem' },
  ];

  const weekBars = [
    { day: 'Seg', value: 2500, barStyle: { width: '100%', height: '120px', background: 'var(--color-accent)', borderRadius: '4px' } },
    { day: 'Ter', value: 2200, barStyle: { width: '100%', height: '105px', background: 'var(--color-accent)', borderRadius: '4px' } },
    { day: 'Qua', value: 2800, barStyle: { width: '100%', height: '135px', background: 'var(--color-accent)', borderRadius: '4px' } },
    { day: 'Qui', value: 3100, barStyle: { width: '100%', height: '150px', background: 'var(--color-accent)', borderRadius: '4px' } },
    { day: 'Sex', value: 3400, barStyle: { width: '100%', height: '165px', background: 'var(--color-accent)', borderRadius: '4px' } },
    { day: 'Sáb', value: 2900, barStyle: { width: '100%', height: '140px', background: 'var(--color-accent)', borderRadius: '4px' } },
    { day: 'Dom', value: 2100, barStyle: { width: '100%', height: '100px', background: 'var(--color-accent)', borderRadius: '4px' } },
  ];

  const lowStock = [
    { nome: 'Shampoo Premium', restante: '15%', barStyle: { width: '15%', height: '6px', background: 'var(--color-accent-600)', borderRadius: '3px' } },
    { nome: 'Cera Brilho', restante: '28%', barStyle: { width: '28%', height: '6px', background: 'var(--color-accent-500)', borderRadius: '3px' } },
    { nome: 'Pano de Microfibra', restante: '8%', barStyle: { width: '8%', height: '6px', background: 'var(--color-accent-700)', borderRadius: '3px' } },
    { nome: 'Espuma Ativa', restante: '42%', barStyle: { width: '42%', height: '6px', background: 'var(--color-accent-400)', borderRadius: '3px' } },
  ];

  const washingQueue = [
    { id: 1, placa: 'ABC-1234', cliente: 'João Silva', status: 'Em serviço', tempo: '15 min' },
    { id: 2, placa: 'XYZ-5678', cliente: 'Maria Santos', status: 'Aguardando', tempo: '22 min' },
    { id: 3, placa: 'DEF-9012', cliente: 'Pedro Costa', status: 'Qualidade', tempo: '8 min' },
    { id: 4, placa: 'GHI-3456', cliente: 'Ana Paula', status: 'Aguardando', tempo: '35 min' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <Navigation />

      <div style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div>
            <h2 style={{ margin: 0 }}>Dashboard</h2>
            <div className="text-muted" style={{ fontSize: '13px' }}>{currentDate}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--color-neutral-200)', borderRadius: '10px', padding: '8px 12px', width: '280px', background: 'var(--color-surface)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="text-muted" style={{ fontSize: '13px' }}>Buscar placa, cliente...</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          {kpis.map((k, i) => (
            <KPICard key={i} label={k.label} value={k.value} delta={k.delta} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <WeeklyRevenueChart bars={weekBars} />
          <LowStockAlert items={lowStock} />
        </div>

        <WashingQueueTable items={washingQueue} />
      </div>
    </div>
  );
}
