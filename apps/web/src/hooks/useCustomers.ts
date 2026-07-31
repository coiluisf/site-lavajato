'use client';

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { useCompanyContext } from '@/context/CompanyContext';
import { CreateCustomerDto, UpdateCustomerDto, Customer } from '@/types/dto';

export const useCustomers = () => {
  const { companyId } = useCompanyContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = async (p: number = 1) => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.fetchCustomers(companyId, p, 20);
      setCustomers(response.data || []);
      setTotal(response.total || 0);
      setPage(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const create = async (dto: CreateCustomerDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.createCustomer(companyId, dto);
    } catch (err) {
      throw err;
    }
  };

  const update = async (customerId: number, dto: UpdateCustomerDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.updateCustomer(companyId, customerId, dto);
    } catch (err) {
      throw err;
    }
  };

  const delete_ = async (customerId: number) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.deleteCustomer(companyId, customerId);
    } catch (err) {
      throw err;
    }
  };

  const search = async (query: string) => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.searchCustomers(companyId, query);
      setCustomers(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  return { customers, loading, error, page, total, fetch, create, update, delete: delete_, search };
};
