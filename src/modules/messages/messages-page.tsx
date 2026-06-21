import { Search, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DataTable } from '../../components/data-table';
import {
  deleteMessage,
  markMessageAsRead,
} from './api/messages.api';
import { useMessages } from './hooks/use-messages';

export default function MessagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useMessages({
    page,
    limit: 10,
    search: search || undefined,
  });

  const readMutation = useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      toast.success('Message marked as read');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => toast.error('Failed to update message'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => {
      toast.success('Message deleted');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: () => toast.error('Failed to delete message'),
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Messages
          </h2>

          <p className="mt-2 text-slate-400">
            Contact form messages.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        <DataTable minWidthClass="min-w-[760px]">
          <thead className="bg-slate-950 text-left text-sm text-slate-400">
            <tr>
              <th className="px-4 py-3 xl:px-6 xl:py-4">Name</th>
              <th className="px-4 py-3 xl:px-6 xl:py-4">Email</th>
              <th className="px-4 py-3 xl:px-6 xl:py-4">Phone</th>
              <th className="px-4 py-3 xl:px-6 xl:py-4">Status</th>
              <th className="px-4 py-3 xl:px-6 xl:py-4">Date</th>
              <th className="px-4 py-3 text-right xl:px-6 xl:py-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-red-400"
                >
                  Failed to load messages
                </td>
              </tr>
            )}

            {data?.data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-800"
              >
                <td className="whitespace-nowrap px-4 py-3 text-white xl:px-6 xl:py-4">
                  {item.name}
                </td>

                <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                  {item.email}
                </td>

                <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                  {item.phone || '-'}
                </td>

                <td className="px-4 py-3 xl:px-6 xl:py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.isRead
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {item.isRead ? 'Read' : 'Unread'}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right xl:px-6 xl:py-4">
                  {!item.isRead && (
                    <button
                      onClick={() =>
                        readMutation.mutate(item.id)
                      }
                      className="mr-2 rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <Eye size={18} />
                    </button>
                  )}

                  <button
                    onClick={() =>
                      deleteMutation.mutate(item.id)
                    }
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading &&
              data?.data.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-slate-400"
                  >
                    No messages found.
                  </td>
                </tr>
              )}
          </tbody>
        </DataTable>
      </div>

      <div className="mt-6 flex items-center justify-between text-slate-400">
        <p>
          Page {data?.meta.page ?? page} of{' '}
          {data?.meta.totalPages ?? 1}
        </p>

        <div className="flex gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page >= (data?.meta.totalPages ?? 1)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-700 px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}