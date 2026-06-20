import { api } from '../../../services/api';

export type PackageItem = {
  id: string;
  title: string;
  description: string;
  price: string | number;
  duration?: number | null;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PackagesResponse = {
  success: boolean;
  message: string;
  data: PackageItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getPackages(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { data } = await api.get<PackagesResponse>('/packages', {
    params,
  });

  return data;
}
export async function createPackage(formData: FormData) {
  const { data } = await api.post('/packages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
}
export async function deletePackage(id: string) {
  const { data } = await api.delete(`/packages/${id}`);
  return data;
}
export async function updatePackage(
  id: string,
  data: {
    title: string;
    description: string;
    price: number;
    duration?: number;
    isActive: boolean;
  },
) {
  const response = await api.patch(`/packages/${id}`, data);
  return response.data;
}