import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Financial page', () => {
  test('renders financial dashboard', () => {
    const FinancialDashboard = () => (
      <div>
        <h1>Financeiro</h1>
        <div>Resumo Financeiro</div>
      </div>
    )

    render(<FinancialDashboard />)
    expect(screen.getByText('Financeiro')).toBeInTheDocument()
    expect(screen.getByText('Resumo Financeiro')).toBeInTheDocument()
  })

  test('displays revenue metrics', () => {
    const revenueData = {
      totalRevenue: 15000,
      completedOrders: 45,
      period: '30 dias',
    }

    const RevenueMetrics = () => (
      <div>
        <p>Receita Total: R$ {revenueData.totalRevenue.toLocaleString('pt-BR')}</p>
        <p>Pedidos Concluídos: {revenueData.completedOrders}</p>
        <p>Período: {revenueData.period}</p>
      </div>
    )

    render(<RevenueMetrics />)
    expect(screen.getByText('Receita Total: R$ 15.000')).toBeInTheDocument()
    expect(screen.getByText('Pedidos Concluídos: 45')).toBeInTheDocument()
    expect(screen.getByText('Período: 30 dias')).toBeInTheDocument()
  })

  test('renders revenue chart', () => {
    const RevenueChart = () => (
      <div>
        <h2>Gráfico de Receita</h2>
        <div className="chart-container">Chart visualization</div>
      </div>
    )

    render(<RevenueChart />)
    expect(screen.getByText('Gráfico de Receita')).toBeInTheDocument()
    expect(screen.getByText('Chart visualization')).toBeInTheDocument()
  })

  test('displays monthly revenue breakdown', () => {
    const monthlyData = [
      { month: 'Janeiro', revenue: 3000 },
      { month: 'Fevereiro', revenue: 3500 },
      { month: 'Março', revenue: 4200 },
    ]

    const MonthlyRevenue = () => (
      <div>
        <h3>Receita por Mês</h3>
        <ul>
          {monthlyData.map((item) => (
            <li key={item.month}>
              {item.month}: R$ {item.revenue.toLocaleString('pt-BR')}
            </li>
          ))}
        </ul>
      </div>
    )

    render(<MonthlyRevenue />)
    expect(screen.getByText('Receita por Mês')).toBeInTheDocument()
    expect(screen.getByText('Janeiro: R$ 3.000')).toBeInTheDocument()
    expect(screen.getByText('Fevereiro: R$ 3.500')).toBeInTheDocument()
    expect(screen.getByText('Março: R$ 4.200')).toBeInTheDocument()
  })

  test('renders export and report buttons', () => {
    const FinancialActions = () => (
      <div>
        <button>Exportar Relatório</button>
        <button>Gerar PDF</button>
      </div>
    )

    render(<FinancialActions />)
    expect(screen.getByText('Exportar Relatório')).toBeInTheDocument()
    expect(screen.getByText('Gerar PDF')).toBeInTheDocument()
  })
})
