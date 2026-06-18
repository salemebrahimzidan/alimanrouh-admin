import { api } from '../../../services/api';

export type DashboardResponse = {
  counts: {
    packages: number;
    bookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
    messages: number;
    unreadMessages: number;
    users: number;
  };

  latestBookings: any[];
  latestMessages: any[];
};

export async function getDashboard() {
  const { data } = await api.get<DashboardResponse>('/dashboard');

  return data;
}