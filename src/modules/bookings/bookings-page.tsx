import { CalendarCheck, Search } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  updateBookingStatus,
  type BookingItem,
  type BookingStatus,
} from './api/bookings.api';
import { useBookings } from './hooks/use-bookings';

const statuses: Array<BookingStatus | ''> = [
  '',
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
];

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<BookingStatus | ''>('');

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useBookings({
    page,
    limit: 10,
    search: search || undefined,
    status,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: BookingStatus;
    }) => updateBookingStatus(id, status),
    onSuccess: () => {
      toast.success('Booking status updated');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Failed to update booking');
    },
  });

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-GB');
  }

  function getStatusClass(value: BookingStatus) {
    if (value === 'CONFIRMED') return 'bg-emerald-500/10 text-emerald-400';
    if (value === 'CANCELLED') return 'bg-red-500/10 text-red-400';
    return 'bg-yellow-500/10 text-yellow-400';
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Bookings</h2>
          <p className="mt-2 text-slate-400">
            Manage customer booking requests.
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-400">
          <CalendarCheck size={24} />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name, phone, or email..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as BookingStatus | '');
            setPage(1);
          }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
        >
          {statuses.map((item) => (
            <option key={item || 'ALL'} value={item}>
              {item || 'All Statuses'}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-950 text-left text-sm text-slate-400">
            <tr>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Package</th>
              <th className="px-6 py-4">Travel Date</th>
              <th className="px-6 py-4">Guests</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Loading bookings...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-red-400">
                  Failed to load bookings.
                </td>
              </tr>
            )}

            {!isLoading &&
              data?.data?.map((booking: BookingItem) => (
                <tr
                  key={booking.id}
                  className="border-t border-slate-800 text-sm text-slate-300"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{booking.fullName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {booking.phone}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {booking.package?.title ?? '-'}
                  </td>

                  <td className="px-6 py-4">
                    {formatDate(booking.travelDate)}
                  </td>

                  <td className="px-6 py-4">
                    {booking.adults} Adults / {booking.children} Children
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <select
                      value={booking.status}
                      disabled={statusMutation.isPending}
                      onChange={(event) =>
                        statusMutation.mutate({
                          id: booking.id,
                          status: event.target.value as BookingStatus,
                        })
                      }
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}

            {!isLoading && data?.data?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between text-slate-400">
        <p>
          Page {data?.meta?.page ?? page} of {data?.meta?.totalPages ?? 1}
        </p>

        <div className="flex gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page >= (data?.meta?.totalPages ?? 1)}
            onClick={() => setPage((value) => value + 1)}
            className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}