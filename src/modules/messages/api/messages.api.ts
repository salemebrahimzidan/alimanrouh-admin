import { api } from '../../../services/api';

export type MessageItem = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type MessagesResponse = {
  success: boolean;
  message: string;
  data: MessageItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function getMessages(params: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { data } = await api.get<MessagesResponse>('/contact', {
    params,
  });

  return data;
}

export async function markMessageAsRead(id: string) {
  const { data } = await api.patch(`/contact/${id}/read`);
  return data;
}

export async function deleteMessage(id: string) {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
}