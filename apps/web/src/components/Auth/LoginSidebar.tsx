export function LoginSidebar() {
  return (
    <div style={{
      background: 'var(--color-neutral-900)',
      color: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '56px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 15% 85%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 55%)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '9px',
          background: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-neutral-900)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px' }}>
          NitroWash
        </span>
      </div>

      <div style={{ position: 'relative', maxWidth: '440px' }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 800,
          fontSize: '38px',
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
          marginBottom: '16px',
        }}>
          Gestão completa do seu lava-jato, em um só lugar.
        </div>
        <div style={{
          fontSize: '15px',
          color: 'color-mix(in srgb, var(--color-bg) 70%, transparent)',
          lineHeight: 1.6,
        }}>
          Lavagens, agendamentos, estoque, equipe e financeiro — acompanhados em tempo real, com a confiança de um sistema pensado para o seu dia a dia.
        </div>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: '32px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px' }}>120+</div>
          <div style={{ fontSize: '12.5px', color: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
            Unidades ativas
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '22px' }}>98%</div>
          <div style={{ fontSize: '12.5px', color: 'color-mix(in srgb, var(--color-bg) 60%, transparent)' }}>
            Satisfação dos gestores
          </div>
        </div>
      </div>
    </div>
  );
}
