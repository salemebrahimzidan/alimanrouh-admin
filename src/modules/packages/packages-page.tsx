import { Search } from 'lucide-react';
import { useState } from 'react';

import { usePackages } from './hooks/use-packages';

export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = usePackages({
    page,
    limit: 10,
    search: search || undefined,
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Packages</h2>
          <p className="mt-2 text-slate-400">
            Manage Umrah and travel packages.
          </p>
        </div>

        <button className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400">
          + Add Package
        </button>
      </div>

      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
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
            placeholder="Search packages..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-950 text-left text-sm text-slate-400">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Duration</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Loading packages...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-red-400">
                  Failed to load packages.
                </td>
              </tr>
            )}

            {!isLoading &&
              data?.data?.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-800 text-sm text-slate-300"
                >
                  <td className="px-6 py-4">
                    {item.imageUrl ? (
                      <img
                        src={
                          item.imageUrl.startsWith('http')
                            ? item.imageUrl
                            : `https://alimanrouh-api-production.up.railway.app${item.imageUrl}`
                        }
                        alt={item.title}
                        className="h-14 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-500">
                        No image
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium text-white">
                    {item.title}
                  </td>

                  <td className="px-6 py-4">{item.price} SAR</td>

                  <td className="px-6 py-4">
                    {item.duration ? `${item.duration} days` : '-'}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="mr-3 text-emerald-400 hover:text-emerald-300">
                      Edit
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {!isLoading && data?.data?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  No packages found.
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