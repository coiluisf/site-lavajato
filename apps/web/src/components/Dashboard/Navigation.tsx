'use client';

import { useState } from 'react';

export function Navigation() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M22 3L2 3.46v16.54h20V3z' },
    { id: 'lavagens', label: 'Lavagens', icon: 'M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z' },
    { id: 'agendamentos', label: 'Agendamentos', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
    { id: 'financeiro', label: 'Financeiro', icon: 'M12 1v22m11-16H1m3 5h16' },
  ];

  return (
    <div className="nav" style={{ padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--color-neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '40px' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
          </svg>
        </div>
        <span className="nav-brand">NitroWash</span>
      </div>

      {navItems.map((item) => (
        <a
          key={item.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(item.id);
          }}
          aria-current={currentPage === item.id ? 'page' : undefined}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600' }}
        >
          <span style={{ display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
          </span>
          {item.label}
        </a>
      ))}

      <button className="btn btn-primary" onClick={() => {}} style={{ marginLeft: 'auto', borderRadius: '10px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nova lavagem
      </button>
    </div>
  );
}
