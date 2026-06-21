import { Package, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createPackage,
  deletePackage,
  updatePackage,
} from './api/packages.api';
import type { PackageItem } from './api/packages.api';
import { DataTable } from '../../components/data-table';
import DeletePackageDialog from './components/delete-package-dialog';
import PackageForm from './components/package-form';
import { usePackages } from './hooks/use-packages';
import type { PackageFormValues } from './types';

type PackageModalProps = {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
};

function PackageModal({ title, subtitle, onClose, children }: PackageModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-slate-800 bg-slate-900 shadow-2xl sm:max-w-xl sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>
              <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6">{children}</div>
      </div>
    </div>
  );
}

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

  function renderPackageImage(item: PackageItem, className: string) {
    if (item.imageUrl) {
      return (
        <img
          src={getImageUrl(item.imageUrl)}
          alt={item.title}
          className={className}
        />
      );
    }

    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-500 ${className}`}
      >
        No image
      </div>
    );
  }

  const packages = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between lg:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Packages</h2>
          <p className="mt-1 text-sm text-slate-400 sm:mt-2 sm:text-base">
            Manage Umrah and travel packages.
          </p>
        </div>

        <button
          onClick={() => {
            setPackageToEdit(null);
            setIsCreateOpen(true);
          }}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 sm:w-auto sm:text-base"
        >
          <Plus size={18} />
          Add Package
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:p-4">
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
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-emerald-500 sm:py-3 sm:text-base"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
        {isLoading && (
          <div className="p-6 text-center text-slate-400 sm:p-10">
            Loading packages...
          </div>
        )}

        {isError && (
          <div className="p-6 text-center text-red-400 sm:p-10">
            Failed to load packages.
          </div>
        )}

        {!isLoading && !isError && packages.length === 0 && (
          <div className="p-6 text-center text-slate-400 sm:p-10">
            No packages found.
          </div>
        )}

        {!isLoading && !isError && packages.length > 0 && (
          <DataTable minWidthClass="min-w-[760px]">
            <thead className="bg-slate-950 text-left text-sm text-slate-400">
              <tr>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Image</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Title</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Price</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Duration</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Status</th>
                <th className="px-4 py-3 text-right xl:px-6 xl:py-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {packages.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-800 text-sm text-slate-300"
                >
                  <td className="px-4 py-3 xl:px-6 xl:py-4">
                    {renderPackageImage(
                      item,
                      'h-14 w-20 rounded-lg object-cover',
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 font-medium text-white xl:px-6 xl:py-4">
                    {item.title}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    {item.price} SAR
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    {item.duration ? `${item.duration} days` : '-'}
                  </td>

                  <td className="px-4 py-3 xl:px-6 xl:py-4">
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

                  <td className="px-4 py-3 text-right xl:px-6 xl:py-4">
                    <button
                      onClick={() => setPackageToEdit(item)}
                      className="mr-2 rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/10"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => setPackageToDelete(item)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
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

      {isCreateOpen && (
        <PackageModal
          title="Add Package"
          subtitle="Create a new travel or Umrah package"
          onClose={() => setIsCreateOpen(false)}
        >
          <PackageForm
            onCancel={() => setIsCreateOpen(false)}
            onSubmit={handleCreatePackage}
            isSubmitting={createMutation.isPending}
            submitLabel="Create Package"
          />
        </PackageModal>
      )}

      {packageToEdit && (
        <PackageModal
          title="Edit Package"
          subtitle={`Updating "${packageToEdit.title}"`}
          onClose={() => setPackageToEdit(null)}
        >
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
        </PackageModal>
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