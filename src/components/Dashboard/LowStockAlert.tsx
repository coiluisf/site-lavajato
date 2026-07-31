interface LowStockItem {
  nome: string;
  restante: string;
  barStyle: React.CSSProperties;
}

interface LowStockAlertProps {
  items: LowStockItem[];
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  return (
    <div className="card" style={{ borderRadius: '14px', boxShadow: 'var(--shadow-sm)', background: 'var(--color-surface)' }}>
      <h5 style={{ margin: '0 0 var(--space-3)' }}>Estoque crítico</h5>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {items.map((s, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
              <span style={{ fontWeight: '600' }}>{s.nome}</span>
              <span style={{ fontWeight: '700' }}>{s.restante}</span>
            </div>
            <div style={{ height: '6px', background: 'var(--color-neutral-200)', borderRadius: '3px' }}>
              <div style={s.barStyle}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
