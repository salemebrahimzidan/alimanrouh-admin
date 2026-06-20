import { api } from '../../../services/api';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type BookingItem = {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  adults: number;
  children: number;
  travelDate: string;
  notes?: string | null;
  status: BookingStatus;
  packageId: string;
  createdAt: string;
  updatedAt: string;
  package?: {
    id: string;
    title: string;
    price: string | number;
  };
};

export type BookingsResponse = {
  success: boolean;
  message: string;
  data: BookingItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getBookings(params: {
    page: number;
    limit: number;
    search?: string;
    status?: BookingStatus | '';
  }) {
    const cleanParams: Record<string, string | number> = {
      page: params.page,
      limit: params.limit,
    };
  
    if (params.search) {
      cleanParams.search = params.search;
    }
  
    if (params.status) {
      cleanParams.status = params.status;
    }
  
    const { data } = await api.get<BookingsResponse>('/bookings', {
      params: cleanParams,
    });
  
    return data;
  }

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
) {
  const { data } = await api.patch(`/bookings/${id}/status`, {
    status,
  });

  return data;
}