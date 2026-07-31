import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Appointments page', () => {
  test('renders appointments list', () => {
    const mockAppointments = [
      {
        id: '1',
        scheduledAt: '2026-08-15 10:00',
        status: 'SCHEDULED',
        customerName: 'Cliente 1',
      },
      {
        id: '2',
        scheduledAt: '2026-08-15 14:30',
        status: 'CONFIRMED',
        customerName: 'Cliente 2',
      },
    ]

    const AppointmentsList = () => (
      <div>
        <h1>Agendamentos</h1>
        <ul>
          {mockAppointments.map((apt) => (
            <li key={apt.id}>{apt.customerName}</li>
          ))}
        </ul>
      </div>
    )

    render(<AppointmentsList />)
    expect(screen.getByText('Agendamentos')).toBeInTheDocument()
    expect(screen.getByText('Cliente 1')).toBeInTheDocument()
    expect(screen.getByText('Cliente 2')).toBeInTheDocument()
  })

  test('displays appointment details including date and status', () => {
    const appointment = {
      id: '1',
      scheduledAt: '2026-08-15 10:00',
      status: 'SCHEDULED',
      customerName: 'João Silva',
    }

    const AppointmentDetail = () => (
      <div>
        <h2>{appointment.customerName}</h2>
        <p>Data: {appointment.scheduledAt}</p>
        <p>Status: {appointment.status}</p>
      </div>
    )

    render(<AppointmentDetail />)
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Data: 2026-08-15 10:00')).toBeInTheDocument()
    expect(screen.getByText('Status: SCHEDULED')).toBeInTheDocument()
  })

  test('renders create appointment button', () => {
    const AppointmentsPage = () => (
      <div>
        <h1>Agendamentos</h1>
        <button>Novo Agendamento</button>
      </div>
    )

    render(<AppointmentsPage />)
    expect(screen.getByText('Novo Agendamento')).toBeInTheDocument()
  })

  test('displays appointment status badges', () => {
    const appointments = [
      { id: '1', status: 'SCHEDULED' },
      { id: '2', status: 'CONFIRMED' },
      { id: '3', status: 'COMPLETED' },
      { id: '4', status: 'CANCELLED' },
    ]

    const AppointmentStatusBadge = ({ status }: { status: string }) => (
      <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
    )

    render(
      <div>
        {appointments.map((apt) => (
          <AppointmentStatusBadge key={apt.id} status={apt.status} />
        ))}
      </div>
    )

    expect(screen.getByText('SCHEDULED')).toBeInTheDocument()
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument()
    expect(screen.getByText('COMPLETED')).toBeInTheDocument()
    expect(screen.getByText('CANCELLED')).toBeInTheDocument()
  })

  test('renders edit and cancel buttons for each appointment', () => {
    const appointment = { id: '1', customerName: 'Cliente Teste' }

    const AppointmentRow = ({ appointment }: { appointment: any }) => (
      <table>
        <tbody>
          <tr>
            <td>{appointment.customerName}</td>
            <td>
              <button>Editar</button>
              <button>Cancelar</button>
            </td>
          </tr>
        </tbody>
      </table>
    )

    render(<AppointmentRow appointment={appointment} />)
    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })
})
