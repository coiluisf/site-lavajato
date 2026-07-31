'use client';

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { useCompanyContext } from '@/context/CompanyContext';
import { CreateAppointmentDto, UpdateAppointmentDto, Appointment } from '@/types/dto';

export const useAppointments = () => {
  const { companyId } = useCompanyContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = async (p: number = 1, status?: string, date?: string) => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.fetchAppointments(companyId, status, date, p);
      setAppointments(response.data || []);
      setTotal(response.total || 0);
      setPage(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const fetchToday = async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.fetchTodayAppointments(companyId);
      setAppointments(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const create = async (dto: CreateAppointmentDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.createAppointment(companyId, dto);
    } catch (err) {
      throw err;
    }
  };

  const update = async (appointmentId: number, dto: UpdateAppointmentDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.updateAppointment(companyId, appointmentId, dto);
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (appointmentId: number, status: string) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.updateAppointmentStatus(companyId, appointmentId, status);
    } catch (err) {
      throw err;
    }
  };

  const cancel = async (appointmentId: number) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.cancelAppointment(companyId, appointmentId);
    } catch (err) {
      throw err;
    }
  };

  return { appointments, loading, error, page, total, fetch, fetchToday, create, update, updateStatus, cancel };
};
