import { Pencil, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createPackage,
  deletePackage,
  updatePackage,
} from './api/packages.api';
import type { PackageItem } from './api/packages.api';
import DeletePackageDialog from './components/delete-package-dialog';
import PackageForm from './components/package-form';
import { usePackages } from './hooks/use-packages';
import type { PackageFormValues } from './types';

export default function PackagesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] =
    useState<PackageItem | null>(null);
    const [packageToEdit, setPackageToEdit] =
  useState<PackageItem | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = usePackages({
    page,
    limit: 10,
    search: search || undefined,
  });

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      toast.success('Package created successfully');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setIsCreateOpen(false);
    },
    onError: () => {
      toast.error('Failed to create package');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      toast.success('Package deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setPackageToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete package');
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: PackageFormValues;
    }) =>
      updatePackage(id, {
        title: values.title,
        description: values.description,
        price: values.price,
        duration: values.duration,
        isActive: values.isActive,
      }),
    onSuccess: () => {
      toast.success('Package updated successfully');
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setPackageToEdit(null);
    },
    onError: () => {
      toast.error('Failed to update package');
    },
  });
  function handleCreatePackage(values: PackageFormValues) {
    const formData = new FormData();

    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', String(values.price));

    if (values.duration) {
      formData.append('duration', String(values.duration));
    }

    formData.append('isActive', String(values.isActive));

    if (values.image) {
      formData.append('file', values.image);
    }

    createMutation.mutate(formData);
  }
  function handleUpdatePackage(values: PackageFormValues) {
    if (!packageToEdit) return;
  
    updateMutation.mutate({
      id: packageToEdit.id,
      values,
    });
  }

  function getImageUrl(path?: string | null) {
    if (!path) return '';

    if (path.startsWith('http')) return path;

    return `https://alimanrouh-api-production.up.railway.app${path}`;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Packages</h2>
          <p className="mt-2 text-slate-400">
            Manage Umrah and travel packages.
          </p>
        </div>

        <button
          onClick={() => {
            setPackageToEdit(null);
          
            setIsCreateOpen(true);
          }}
          className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
        >
           <h3 className="text-xl font-bold text-white">
  {packageToEdit ? 'Edit Package' : 'Add Package'}
</h3>
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
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-400"
                >
                  Loading packages...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-red-400"
                >
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
                        src={getImageUrl(item.imageUrl)}
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
                  <button
  onClick={() => setPackageToEdit(item)}
  className="mr-3 rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/10"
>
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => setPackageToDelete(item)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

            {!isLoading && data?.data?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-slate-400"
                >
                  No packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between text-slate-400">
        <p>
          Page {data?.meta?.page ?? page} of{' '}
          {data?.meta?.totalPages ?? 1}
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

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-white">Add Package</h3>

            <PackageForm
              onCancel={() => setIsCreateOpen(false)}
              onSubmit={handleCreatePackage}
              isSubmitting={createMutation.isPending}
            />
          </div>
        </div>
      )}
      {packageToEdit && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
    <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-xl font-bold text-white">Edit Package</h3>

      <PackageForm
        initialValues={{
          title: packageToEdit.title,
          description: packageToEdit.description,
          price: Number(packageToEdit.price),
          duration: packageToEdit.duration ?? undefined,
          isActive: packageToEdit.isActive,
        }}
        submitLabel="Update Package"
        onCancel={() => setPackageToEdit(null)}
        onSubmit={handleUpdatePackage}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  </div>
)}

      <DeletePackageDialog
        packageItem={packageToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={() => setPackageToDelete(null)}
        onConfirm={() => {
          if (packageToDelete) {
            deleteMutation.mutate(packageToDelete.id);
          }
        }}
      />
    </div>
  );
}