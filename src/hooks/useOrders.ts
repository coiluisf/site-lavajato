'use client';

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { useCompanyContext } from '@/context/CompanyContext';
import { CreateOrderDto, UpdateOrderStatusDto, Order, Revenue } from '@/types/dto';

export const useOrders = () => {
  const { companyId } = useCompanyContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = async (p: number = 1, status?: string) => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.fetchOrders(companyId, status, p);
      setOrders(response.data || []);
      setTotal(response.total || 0);
      setPage(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async (days: number = 30) => {
    if (!companyId) return null;
    try {
      const response = await apiClient.fetchCompanyRevenue(companyId, days);
      setRevenue(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar receita');
      return null;
    }
  };

  const create = async (dto: CreateOrderDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.createOrder(companyId, dto);
    } catch (err) {
      throw err;
    }
  };

  const updateStatus = async (orderId: number, dto: UpdateOrderStatusDto) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.updateOrderStatus(companyId, orderId, dto);
    } catch (err) {
      throw err;
    }
  };

  const cancel = async (orderId: number) => {
    if (!companyId) throw new Error('Company ID not set');
    try {
      await apiClient.cancelOrder(companyId, orderId);
    } catch (err) {
      throw err;
    }
  };

  return { orders, revenue, loading, error, page, total, fetch, fetchRevenue, create, updateStatus, cancel };
};
