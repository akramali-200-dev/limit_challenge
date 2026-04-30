'use client';

import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/lib/api-client';
import { Broker } from '@/lib/types';

async function fetchBrokers() {
  const response = await apiClient.get<{ count: number; results: Broker[] }>('/brokers/');
  return response.data.results;
}

export function useBrokerOptions() {
  return useQuery({
    queryKey: ['brokers'],
    queryFn: fetchBrokers,
    enabled: true,
    staleTime: 300_000,
  });
}
