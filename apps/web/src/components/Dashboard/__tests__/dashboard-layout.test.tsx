import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLayout } from '../DashboardLayout';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

describe('DashboardLayout', () => {
  it('renders navigation tabs', () => {
    const mockOnTabChange = jest.fn();
    render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Serviços')).toBeInTheDocument();
    expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    expect(screen.getByText('Financeiro')).toBeInTheDocument();
  });

  it('highlights current tab', () => {
    const mockOnTabChange = jest.fn();
    const { container } = render(
      <DashboardLayout currentTab="customers" onTabChange={mockOnTabChange}>
        <div>Content</div>
      </DashboardLayout>
    );

    const customerTab = screen.getByText('Clientes').closest('button');
    expect(customerTab).toHaveStyle({ borderBottom: '3px solid var(--color-accent)' });
  });

  it('calls onTabChange when tab is clicked', () => {
    const mockOnTabChange = jest.fn();
    render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>Content</div>
      </DashboardLayout>
    );

    const servicesTab = screen.getByText('Serviços');
    fireEvent.click(servicesTab);

    expect(mockOnTabChange).toHaveBeenCalledWith('services');
  });

  it('renders logout button', () => {
    const mockOnTabChange = jest.fn();
    render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('renders children content', () => {
    const mockOnTabChange = jest.fn();
    render(
      <DashboardLayout currentTab="overview" onTabChange={mockOnTabChange}>
        <div>Test Content Here</div>
      </DashboardLayout>
    );

    expect(screen.getByText('Test Content Here')).toBeInTheDocument();
  });
});
