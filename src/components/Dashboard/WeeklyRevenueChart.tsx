interface WeeklyRevenueChartProps {
  bars: Array<{ day: string; value: number; barStyle: React.CSSProperties }>;
}

export function WeeklyRevenueChart({ bars }: WeeklyRevenueChartProps) {
  return (
    <div className="card" style={{ borderRadius: '14px', boxShadow: 'var(--shadow-sm)', background: 'var(--color-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h5 style={{ margin: 0 }}>Faturamento da semana</h5>
        <span className="text-muted" style={{ fontSize: '11px' }}>R$ por dia</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', height: '150px' }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
            <div style={b.barStyle}></div>
            <div style={{ fontSize: '11px', fontWeight: '600' }} className="text-muted">{b.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
