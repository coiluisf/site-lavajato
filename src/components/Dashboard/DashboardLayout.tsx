'use client';

import React from 'react';

export type TabType = 'overview' | 'customers' | 'services' | 'appointments' | 'financial';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentTab,
  onTabChange,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'customers', label: 'Clientes', icon: '👥' },
    { id: 'services', label: 'Serviços', icon: '🚗' },
    { id: 'appointments', label: 'Agendamentos', icon: '📅' },
    { id: 'financial', label: 'Financeiro', icon: '💰' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-neutral-50)' }}>
      {/* Navigation Bar */}
      <nav
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid var(--color-neutral-200)',
          padding: '0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
              padding: '0 2rem',
              minHeight: '4rem',
            }}
          >
            {/* Logo */}
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-accent)', minWidth: 'fit-content' }}>
              🧼 LavaJato
            </div>

            {/* Tab Navigation */}
            <div
              style={{
                display: 'flex',
                gap: '0rem',
                flex: 1,
                borderBottom: '1px solid var(--color-neutral-200)',
                marginBottom: '-1px',
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: currentTab === tab.id ? '3px solid var(--color-accent)' : 'none',
                    color: currentTab === tab.id ? 'var(--color-accent)' : 'var(--color-neutral-600)',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: currentTab === tab.id ? '600' : '400',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (currentTab !== tab.id) {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'var(--color-neutral-50)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentTab !== tab.id) {
                      (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ marginRight: '0.5rem' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* User Menu Placeholder */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                paddingLeft: '1rem',
                borderLeft: '1px solid var(--color-neutral-200)',
              }}
            >
              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--color-neutral-100)',
                  border: '1px solid var(--color-neutral-200)',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                }}
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};
