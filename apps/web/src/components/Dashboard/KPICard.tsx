interface KPICardProps {
  label: string;
  value: string | number;
  delta: string;
}

export function KPICard({ label, value, delta }: KPICardProps) {
  return (
    <div className="card" style={{ borderRadius: '14px' }}>
      <div className="card-kicker">{label}</div>
      <div className="card-title" style={{ fontSize: '30px' }}>{value}</div>
      <div className="card-meta">{delta}</div>
    </div>
  );
}
