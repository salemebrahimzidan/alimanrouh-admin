import { Pencil, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DataTable } from '../../components/data-table';
import DeleteUserDialog from './components/delete-user-dialog';
import UserForm from './components/user-form';
import {
  createUser,
  deleteUser,
  updateUser,
  type CreateUserPayload,
  type UpdateUserPayload,
  type UserItem,
} from './api/users.api';
import { useUsers } from './hooks/use-users';

type UserModalProps = {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
};

function UserModal({ title, subtitle, onClose, children }: UserModalProps) {
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
              <Users size={20} />
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

export default function UsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);

  const [form, setForm] = useState<CreateUserPayload>({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useUsers();

  function resetForm() {
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
    });
    setEditingUser(null);
    setIsCreateOpen(false);
  }

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    },
    onError: () => toast.error('Failed to create user'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      resetForm();
    },
    onError: () => toast.error('Failed to update user'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUserToDelete(null);
    },
    onError: () => toast.error('Failed to delete user'),
  });

  function openCreate() {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'ADMIN',
    });
    setIsCreateOpen(true);
  }

  function openEdit(user: UserItem) {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsCreateOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingUser) {
      updateMutation.mutate({
        id: editingUser.id,
        data: {
          name: form.name,
          email: form.email,
          role: form.role,
        },
      });
      return;
    }

    createMutation.mutate(form);
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between lg:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Users</h2>
          <p className="mt-1 text-sm text-slate-400 sm:mt-2 sm:text-base">
            Manage admin users.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 sm:w-auto sm:text-base"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        {isLoading && (
          <div className="p-6 text-center text-slate-400 sm:p-10">
            Loading users...
          </div>
        )}

        {isError && (
          <div className="p-6 text-center text-red-400 sm:p-10">
            Failed to load users.
          </div>
        )}

        {!isLoading && !isError && (data?.length ?? 0) === 0 && (
          <div className="p-6 text-center text-slate-400 sm:p-10">
            No users found.
          </div>
        )}

        {!isLoading && !isError && (data?.length ?? 0) > 0 && (
          <DataTable minWidthClass="min-w-[720px]">
            <thead className="bg-slate-950 text-left text-sm text-slate-400">
              <tr>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Name</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Email</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Role</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Status</th>
                <th className="px-4 py-3 xl:px-6 xl:py-4">Created</th>
                <th className="px-4 py-3 text-right xl:px-6 xl:py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((user) => (
                <tr key={user.id} className="border-t border-slate-800 text-sm text-slate-300">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-white xl:px-6 xl:py-4">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    {user.role}
                  </td>

                  <td className="px-4 py-3 xl:px-6 xl:py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        user.isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 xl:px-6 xl:py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-right xl:px-6 xl:py-4">
                    <button
                      onClick={() => openEdit(user)}
                      className="mr-2 rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/10"
                      aria-label={`Edit ${user.name}`}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => setUserToDelete(user)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                      aria-label={`Delete ${user.name}`}
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

      {isCreateOpen && (
        <UserModal
          title={editingUser ? 'Edit User' : 'Add User'}
          subtitle={
            editingUser
              ? `Updating "${editingUser.name}"`
              : 'Create a new admin account'
          }
          onClose={resetForm}
        >
          <UserForm
            values={form}
            isEditing={Boolean(editingUser)}
            isSubmitting={isSaving}
            onChange={setForm}
            onCancel={resetForm}
            onSubmit={handleSubmit}
          />
        </UserModal>
      )}

      <DeleteUserDialog
        user={userToDelete}
        isDeleting={deleteMutation.isPending}
        onClose={() => setUserToDelete(null)}
        onConfirm={() => {
          if (userToDelete) {
            deleteMutation.mutate(userToDelete.id);
          }
        }}
      />
    </div>
  );
}
