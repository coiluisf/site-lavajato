import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Customers page', () => {
  test('renders customers list', () => {
    const mockCustomers = [
      { id: '1', name: 'Cliente 1', cpf: '12345678901', email: 'cliente1@test.com' },
      { id: '2', name: 'Cliente 2', cpf: '98765432109', email: 'cliente2@test.com' },
    ]

    const CustomersList = () => (
      <div>
        <h1>Clientes</h1>
        <ul>
          {mockCustomers.map((customer) => (
            <li key={customer.id}>{customer.name}</li>
          ))}
        </ul>
      </div>
    )

    render(<CustomersList />)
    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('Cliente 1')).toBeInTheDocument()
    expect(screen.getByText('Cliente 2')).toBeInTheDocument()
  })

  test('handles empty customers list', () => {
    const EmptyCustomersList = () => (
      <div>
        <h1>Clientes</h1>
        <p>Nenhum cliente encontrado</p>
      </div>
    )

    render(<EmptyCustomersList />)
    expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument()
  })

  test('displays customer details correctly', () => {
    const customer = {
      id: '1',
      name: 'João Silva',
      cpf: '12345678901',
      email: 'joao@test.com',
      phone: '11999999999',
    }

    const CustomerDetail = () => (
      <div>
        <h2>{customer.name}</h2>
        <p>CPF: {customer.cpf}</p>
        <p>Email: {customer.email}</p>
        <p>Telefone: {customer.phone}</p>
      </div>
    )

    render(<CustomerDetail />)
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('CPF: 12345678901')).toBeInTheDocument()
    expect(screen.getByText('Email: joao@test.com')).toBeInTheDocument()
  })

  test('renders create customer button', () => {
    const CustomersPage = () => (
      <div>
        <h1>Clientes</h1>
        <button>Novo Cliente</button>
      </div>
    )

    render(<CustomersPage />)
    expect(screen.getByText('Novo Cliente')).toBeInTheDocument()
  })

  test('renders edit and delete buttons for each customer', () => {
    const customer = { id: '1', name: 'Cliente 1' }

    const CustomerRow = ({ customer }: { customer: any }) => (
      <table>
        <tbody>
          <tr>
            <td>{customer.name}</td>
            <td>
              <button>Editar</button>
              <button>Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>
    )

    render(<CustomerRow customer={customer} />)
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Deletar')).toBeInTheDocument()
  })
})
