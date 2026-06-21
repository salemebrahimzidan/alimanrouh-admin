import { CalendarCheck, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DataTable } from '../../components/data-table';
import {
  updateBookingStatus,
  type BookingStatus,
} from './api/bookings.api';
import { useBookings } from './hooks/use-bookings';

const statuses: Array<BookingStatus | ''> = [
  '',
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB');
}

const statusOptions: Array<{
  value: BookingStatus;
  label: string;
  activeClass: string;
}> = [
  {
    value: 'PENDING',
    label: 'Pending',
    activeClass:
      'border-yellow-500/40 bg-yellow-500/15 text-yellow-400 shadow-sm shadow-yellow-500/10',
  },
  {
    value: 'CONFIRMED',
    label: 'Confirmed',
    activeClass:
      'border-emerald-500/40 bg-emerald-500/15 text-emerald-400 shadow-sm shadow-emerald-500/10',
  },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
    activeClass:
      'border-red-500/40 bg-red-500/15 text-red-400 shadow-sm shadow-red-500/10',
  },
];

type StatusActionsProps = {
  value: BookingStatus;
  disabled?: boolean;
  onChange: (status: BookingStatus) => void;
  compact?: boolean;
};

function StatusActions({
  value,
  disabled,
  onChange,
  compact = false,
}: StatusActionsProps) {
  return (
    <div
      className={`flex ${compact ? 'flex-col gap-1.5' : 'flex-wrap gap-1.5'} min-w-[140px]`}
      role="group"
      aria-label="Update booking status"
    >
      {statusOptions.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled || isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-default ${
              isActive
                ? option.activeClass
                : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:opacity-100'
            } ${compact ? 'w-full text-left' : 'whitespace-nowrap'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

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

  function handleStatusChange(id: string, nextStatus: BookingStatus) {
    statusMutation.mutate({ id, status: nextStatus });
  }

  const bookings = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalBookings = data?.meta?.total ?? bookings.length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between lg:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Bookings
          </h2>
          <p className="mt-1 text-sm text-slate-400 sm:mt-2 sm:text-base">
            Manage customer booking requests.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 sm:w-auto">
          <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
            <CalendarCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-emerald-300/80">Total bookings</p>
            <p className="text-lg font-semibold text-emerald-400">
              {isLoading ? '...' : totalBookings}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:flex-row sm:gap-4 sm:p-4">
        <div className="relative min-w-0 flex-1">
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
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-emerald-500 sm:py-3 sm:text-base"
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as BookingStatus | '');
            setPage(1);
          }}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500 sm:w-auto sm:py-3 sm:text-base"
        >
          {statuses.map((item) => (
            <option key={item || 'ALL'} value={item}>
              {item || 'All Statuses'}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {isLoading && (
          <div className="p-6 text-center text-slate-400 sm:p-10">
            Loading bookings...
          </div>
        )}

        {isError && (
          <div className="p-6 text-center text-red-400 sm:p-10">
            Failed to load bookings.
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="p-6 text-center text-slate-400 sm:p-10">
            No bookings found.
          </div>
        )}

        {!isLoading && !isError && bookings.length > 0 && (
          <DataTable minWidthClass="min-w-[900px]">
            <thead className="bg-slate-950 text-left text-sm text-slate-400">
              <tr>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Customer</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Package</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Travel Date</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Guests</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t border-slate-800 text-sm text-slate-300"
                >
                  <td className="px-4 py-3 xl:px-6 xl:py-4">
                    <p className="whitespace-nowrap font-medium text-white">
                      {booking.fullName}
                    </p>
                    <p className="mt-1 whitespace-nowrap text-xs text-slate-500">
                      {booking.phone}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    {booking.package?.title ?? '-'}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    {formatDate(booking.travelDate)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={14} className="text-slate-500" />
                      {booking.adults}A / {booking.children}C
                    </span>
                  </td>

                  <td className="px-4 py-3 xl:px-6 xl:py-4">
                    <StatusActions
                      value={booking.status}
                      disabled={statusMutation.isPending}
                      onChange={(nextStatus) =>
                        handleStatusChange(booking.id, nextStatus)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-base">
        <p className="text-center sm:text-left">
          Page {data?.meta?.page ?? page} of {totalPages}
        </p>

        <div className="flex gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40 sm:flex-none"
          >
            Previous
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((value) => value + 1)}
            className="flex-1 rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40 sm:flex-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
