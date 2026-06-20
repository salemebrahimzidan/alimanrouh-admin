import { useQuery } from '@tanstack/react-query';

import { getBookings, type BookingStatus } from '../api/bookings.api';

export function useBookings(params: {
  page: number;
  limit: number;
  search?: string;
  status?: BookingStatus | '';
}) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => getBookings(params),
  });
}