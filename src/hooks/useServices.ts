'use client';

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { useCompanyContext } from '@/context/CompanyContext';
import { CreateServiceDto, UpdateServiceDto, Service } from '@/types/dto';

export const useServices = () => {
  const { companyId } = useCompanyContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.fetchServices(companyId);
      setServices(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const create = async (dto: CreateServiceDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.createService(companyId, dto);
    } catch (err) {
      throw err;
    }
  };

  const update = async (serviceId: number, dto: UpdateServiceDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.updateService(companyId, serviceId, dto);
    } catch (err) {
      throw err;
    }
  };

  const delete_ = async (serviceId: number) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.deleteService(companyId, serviceId);
    } catch (err) {
      throw err;
    }
  };

  return { services, loading, error, fetch, create, update, delete: delete_ };
};
