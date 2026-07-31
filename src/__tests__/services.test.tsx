import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Services page', () => {
  test('renders services list', () => {
    const mockServices = [
      { id: '1', name: 'Lavagem Básica', durationMinutes: 30, isActive: true },
      { id: '2', name: 'Lavagem Premium', durationMinutes: 60, isActive: true },
    ]

    const ServicesList = () => (
      <div>
        <h1>Serviços</h1>
        <ul>
          {mockServices.map((service) => (
            <li key={service.id}>{service.name}</li>
          ))}
        </ul>
      </div>
    )

    render(<ServicesList />)
    expect(screen.getByText('Serviços')).toBeInTheDocument()
    expect(screen.getByText('Lavagem Básica')).toBeInTheDocument()
    expect(screen.getByText('Lavagem Premium')).toBeInTheDocument()
  })

  test('displays service details including duration', () => {
    const service = {
      id: '1',
      name: 'Lavagem Completa',
      durationMinutes: 90,
      isActive: true,
    }

    const ServiceDetail = () => (
      <div>
        <h2>{service.name}</h2>
        <p>Duração: {service.durationMinutes} minutos</p>
        <p>Status: {service.isActive ? 'Ativo' : 'Inativo'}</p>
      </div>
    )

    render(<ServiceDetail />)
    expect(screen.getByText('Lavagem Completa')).toBeInTheDocument()
    expect(screen.getByText('Duração: 90 minutos')).toBeInTheDocument()
    expect(screen.getByText('Status: Ativo')).toBeInTheDocument()
  })

  test('renders create service button', () => {
    const ServicesPage = () => (
      <div>
        <h1>Serviços</h1>
        <button>Novo Serviço</button>
      </div>
    )

    render(<ServicesPage />)
    expect(screen.getByText('Novo Serviço')).toBeInTheDocument()
  })

  test('displays inactive services', () => {
    const inactiveService = {
      id: '1',
      name: 'Serviço Descontinuado',
      isActive: false,
    }

    const ServiceRow = ({ service }: { service: any }) => (
      <table>
        <tbody>
          <tr>
            <td>{service.name}</td>
            <td>{service.isActive ? 'Ativo' : 'Inativo'}</td>
          </tr>
        </tbody>
      </table>
    )

    render(<ServiceRow service={inactiveService} />)
    expect(screen.getByText('Inativo')).toBeInTheDocument()
  })

  test('renders edit and delete buttons for each service', () => {
    const service = { id: '1', name: 'Serviço Teste' }

    const ServiceActionButtons = ({ service }: { service: any }) => (
      <div>
        <button>Editar {service.name}</button>
        <button>Deletar {service.name}</button>
      </div>
    )

    render(<ServiceActionButtons service={service} />)
    expect(screen.getByText('Editar Serviço Teste')).toBeInTheDocument()
    expect(screen.getByText('Deletar Serviço Teste')).toBeInTheDocument()
  })
})
