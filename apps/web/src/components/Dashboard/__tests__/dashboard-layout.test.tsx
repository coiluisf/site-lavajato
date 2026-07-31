import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { DashboardLayout } from '../DashboardLayout'

describe('DashboardLayout', () => {
  const mockOnTabChange = jest.fn()

  test('renders DashboardLayout component', () => {
    render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>Test content</div>
      </DashboardLayout>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  test('renders all tabs', () => {
    render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>Test content</div>
      </DashboardLayout>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Agendamentos')).toBeInTheDocument()
    expect(screen.getByText('Financeiro')).toBeInTheDocument()
  })

  test('renders children content correctly', () => {
    const testContent = 'Dashboard test children'
    render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>{testContent}</div>
      </DashboardLayout>
    )
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  test('displays correct current tab', () => {
    render(
      <DashboardLayout currentTab="customers" onTabChange={mockOnTabChange}>
        <div>Test content</div>
      </DashboardLayout>
    )
    expect(screen.getByText('Clientes')).toBeInTheDocument()
  })

  test('allows switching between tabs', () => {
    const { rerender } = render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>Overview content</div>
      </DashboardLayout>
    )
    expect(screen.getByText('Overview content')).toBeInTheDocument()

    rerender(
      <DashboardLayout currentTab="services" onTabChange={mockOnTabChange}>
        <div>Services content</div>
      </DashboardLayout>
    )
    expect(screen.getByText('Services content')).toBeInTheDocument()
  })
})
