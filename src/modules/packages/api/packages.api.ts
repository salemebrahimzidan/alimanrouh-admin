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