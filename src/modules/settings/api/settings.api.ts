import { api } from '../../../services/api';

export type SiteSettings = {
  id: string;
  siteName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  logo?: string;
  heroImage?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSettingsPayload = Omit<
  SiteSettings,
  'id' | 'createdAt' | 'updatedAt'
>;

export async function getSettings() {
  const { data } = await api.get<SiteSettings>('/settings');
  return data;
}

export async function updateSettings(payload: UpdateSettingsPayload) {
  const { data } = await api.patch<SiteSettings>('/settings', payload);
  return data;
}