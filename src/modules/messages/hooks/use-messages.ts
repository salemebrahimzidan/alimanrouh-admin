import { useQuery } from '@tanstack/react-query';

import { getMessages } from '../api/messages.api';

export function useMessages(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['messages', params],
    queryFn: () => getMessages(params),
  });
}