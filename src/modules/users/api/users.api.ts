import { api } from '../../../services/api';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN';

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export async function getUsers() {
  const { data } = await api.get<UserItem[]>('/users');
  return data;
}

export async function createUser(payload: CreateUserPayload) {
  const { data } = await api.post<UserItem>('/users', payload);
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete(`/users/${id}`);
  return data;
}