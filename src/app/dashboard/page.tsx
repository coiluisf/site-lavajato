'use client';

import React, { useEffect } from 'react';
import { useCompanyStats } from '@/hooks/useCompanyStats';
import { useOrders } from '@/hooks/useOrders';
import { useAppointments } from '@/hooks/useAppointments';
import { useCustomers } from '@/hooks/useCustomers';
import { Skeleton } from '@/components/Common/Skeleton';

interface DashboardCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
}

const Dashboard: React.FC = () => {
  const { stats, loading: statsLoading, fetch: fetchStats } = useCompanyStats();
  const { orders, loading: ordersLoading, fetch: fetchOrders } = useOrders();
  const { appointments, loading: appointmentsLoading, fetch: fetchAppointments } = useAppointments();
  const { customers, loading: customersLoading, fetch: fetchCustomers } = useCustomers();

  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchAppointments();
    fetchCustomers();
  }, []);

  const cards: DashboardCard[] = [
    {
      title: 'Clientes',
      value: customers.length,
      subtitle: 'Total registrado',
      icon: '👥',
      color: '#3b82f6',
    },
    {
      title: 'Agendamentos Hoje',
      value: appointments.filter(a => {
        const today = new Date().toISOString().split('T')[0];
        return a.appointmentDate === today;
      }).length,
      subtitle: 'Programados',
      icon: '📅',
      color: '#10b981',
    },
    {
      title: 'Receita (30 dias)',
      value: `R$ ${orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      subtitle: 'Total faturado',
      icon: '💰',
      color: '#f59e0b',
    },
    {
      title: 'Serviços',
      value: stats?.totalServices || 0,
      subtitle: 'Cadastrados',
      icon: '🚗',
      color: '#8b5cf6',
    },
  ];

  const isLoading = statsLoading || ordersLoading || appointmentsLoading || customersLoading;

  const recentOrders = orders.slice(0, 5).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const todayAppointments = appointments
    .filter(a => a.appointmentDate === new Date().toISOString().split('T')[0])
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: '700' }}>
          Bem-vindo ao Dashboard
        </h1>
        <p style={{ margin: '0', color: 'var(--color-neutral-600)' }}>
          Aqui está o resumo do seu negócio
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {isLoading ? (
          <>
            <Skeleton height="8rem" />
            <Skeleton height="8rem" />
            <Skeleton height="8rem" />
            <Skeleton height="8rem" />
          </>
        ) : (
          cards.map((card, idx) => (
            <div
              key={idx}
              style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-neutral-200)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--color-neutral-600)', fontWeight: '500' }}>
                    {card.title}
                  </p>
                  <p style={{ margin: '0', fontSize: '1.75rem', fontWeight: '700', color: card.color }}>
                    {card.value}
                  </p>
                </div>
                <div style={{ fontSize: '2rem' }}>{card.icon}</div>
              </div>
              <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--color-neutral-500)' }}>
                {card.subtitle}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Today's Appointments */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-neutral-200)',
          }}
        >
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
            📅 Agendamentos de Hoje
          </h2>
          {appointmentsLoading ? (
            <Skeleton count={3} height="2.5rem" />
          ) : todayAppointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--color-neutral-50)',
                    borderRadius: '0.375rem',
                    borderLeft: '4px solid var(--color-accent)',
                  }}
                >
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', fontSize: '0.95rem' }}>
                    {apt.startTime} - Cliente #{apt.customerId}
                  </p>
                  <p style={{ margin: '0', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                    Serviço #{apt.serviceId} • {apt.status}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: '0', color: 'var(--color-neutral-600)', textAlign: 'center', padding: '1rem' }}>
              Nenhum agendamento para hoje
            </p>
          )}
        </div>

        {/* Recent Orders */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-neutral-200)',
          }}
        >
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: '600' }}>
            💰 Pedidos Recentes
          </h2>
          {ordersLoading ? (
            <Skeleton count={3} height="2.5rem" />
          ) : recentOrders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--color-neutral-50)',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', fontSize: '0.95rem' }}>
                      Pedido #{order.id}
                    </p>
                    <p style={{ margin: '0', fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                      Cliente #{order.customerId}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontWeight: '700', fontSize: '0.95rem' }}>
                      R$ {order.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p
                      style={{
                        margin: '0',
                        fontSize: '0.75rem',
                        color: order.status === 'completed' ? '#10b981' : '#f59e0b',
                        fontWeight: '600',
                      }}
                    >
                      {order.status === 'completed' ? '✓ Concluído' : '⏳ Pendente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: '0', color: 'var(--color-neutral-600)', textAlign: 'center', padding: '1rem' }}>
              Nenhum pedido registrado
            </p>
          )}
        </div>
      </div>

      {/* Footer Note */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'var(--color-neutral-50)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--color-neutral-600)',
          textAlign: 'center',
        }}
      >
        Dados atualizados em tempo real. Navegue pelas abas para gerenciar clientes, serviços, agendamentos e financeiro.
      </div>
    </div>
  );
};

export default Dashboard;
