interface WashingQueueItem {
  id: number;
  placa: string;
  cliente: string;
  status: string;
  tempo: string;
}

interface WashingQueueTableProps {
  items: WashingQueueItem[];
}

export function WashingQueueTable({ items }: WashingQueueTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em serviço':
        return { background: 'var(--color-accent-200)', color: 'var(--color-accent-800)' };
      case 'Aguardando':
        return { background: 'var(--color-neutral-200)', color: 'var(--color-neutral-800)' };
      case 'Qualidade':
        return { background: 'var(--color-accent-2-200)', color: 'var(--color-accent-2-800)' };
      default:
        return { background: 'var(--color-neutral-100)', color: 'var(--color-text)' };
    }
  };

  return (
    <div className="card" style={{ borderRadius: '14px', boxShadow: 'var(--shadow-sm)', background: 'var(--color-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
        <h5 style={{ margin: 0 }}>Fila de lavagens em andamento</h5>
        <a href="#" style={{ fontSize: '12.5px', fontWeight: '600' }}>Ver tudo →</a>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(32, 30, 29, 0.55)' }}>Placa</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(32, 30, 29, 0.55)' }}>Cliente</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'rgba(32, 30, 29, 0.55)' }}>Status</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: 'rgba(32, 30, 29, 0.55)' }}>Tempo</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const statusColor = getStatusColor(item.status);
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
                  <td style={{ padding: 'var(--space-3)', fontWeight: '600' }}>{item.placa}</td>
                  <td style={{ padding: 'var(--space-3)' }}>{item.cliente}</td>
                  <td style={{ padding: 'var(--space-3)' }}>
                    <span style={{ ...statusColor, padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>{item.status}</span>
                  </td>
                  <td style={{ padding: 'var(--space-3)', textAlign: 'right', fontWeight: '600' }}>{item.tempo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
