'use client';

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { useCompanyContext } from '@/context/CompanyContext';
import { CompanyStats } from '@/types/dto';

export const useCompanyStats = () => {
  const { companyId } = useCompanyContext();
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    if (!companyId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.fetchCompanyStats(companyId);
      setStats(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetch();
  };

  return { stats, loading, error, fetch, refetch };
};
