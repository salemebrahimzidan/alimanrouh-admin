import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DataTable } from '../../components/data-table';
import DeleteUserDialog from './components/delete-user-dialog';
import {
  createUser,
  deleteUser,
  updateUser,
  type CreateUserPayload,
  type UpdateUserPayload,
  type UserItem,
  type UserRole,
} from './api/users.api';
import { useUsers } from './hooks/use-users';

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Users</h2>
          <p className="mt-2 text-slate-400">Manage admin users.</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
        >
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900">
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
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  Loading users...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-red-400">
                  Failed to load users.
                </td>
              </tr>
            )}

            {data?.map((user) => (
              <tr key={user.id} className="border-t border-slate-800 text-sm">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-white xl:px-6 xl:py-4">
                  {user.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-300 xl:px-6 xl:py-4">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-300 xl:px-6 xl:py-4">
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

                <td className="whitespace-nowrap px-4 py-3 text-slate-300 xl:px-6 xl:py-4">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="px-4 py-3 text-right xl:px-6 xl:py-4">
                  <button
                    onClick={() => openEdit(user)}
                    className="mr-2 rounded-lg p-2 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => setUserToDelete(user)}
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading && data?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-bold text-white">
              {editingUser ? 'Edit User' : 'Add User'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />

              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                type="email"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              />

              {!editingUser && (
                <input
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Password"
                  type="password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
                />
              )}

              <select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as UserRole })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-700 px-5 py-2 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  disabled={isSaving}
                  className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-slate-950 disabled:opacity-60"
                >
                  {editingUser
                    ? updateMutation.isPending
                      ? 'Updating...'
                      : 'Update User'
                    : createMutation.isPending
                      ? 'Saving...'
                      : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
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