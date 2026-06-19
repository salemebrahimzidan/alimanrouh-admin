import { useQuery } from '@tanstack/react-query';

import { getPackages } from '../api/packages.api';

export function usePackages(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['packages', params],
    queryFn: () => getPackages(params),
  });
}