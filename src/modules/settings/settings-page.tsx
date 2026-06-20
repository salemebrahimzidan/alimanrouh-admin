import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  updateSettings,
  type UpdateSettingsPayload,
} from './api/settings.api';
import { useSettings } from './hooks/use-settings';

export default function SettingsPage() {
  const { data, isLoading, isError } = useSettings();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateSettingsPayload>({
    siteName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
    logo: '',
    heroImage: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        siteName: data.siteName || '',
        email: data.email || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        address: data.address || '',
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        youtube: data.youtube || '',
        twitter: data.twitter || '',
        logo: data.logo || '',
        heroImage: data.heroImage || '',
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });

  function updateField(key: keyof UpdateSettingsPayload, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  if (isLoading) {
    return <div className="text-slate-400">Loading settings...</div>;
  }

  if (isError) {
    return <div className="text-red-400">Failed to load settings.</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Settings</h2>
          <p className="mt-2 text-slate-400">
            Manage website contact and social information.
          </p>
        </div>

        <button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          <Save size={18} />
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {[
          ['siteName', 'Site Name'],
          ['email', 'Email'],
          ['phone', 'Phone'],
          ['whatsapp', 'WhatsApp'],
          ['address', 'Address'],
          ['facebook', 'Facebook URL'],
          ['instagram', 'Instagram URL'],
          ['youtube', 'YouTube URL'],
          ['twitter', 'X / Twitter URL'],
          ['logo', 'Logo URL'],
          ['heroImage', 'Hero Image URL'],
        ].map(([key, label]) => (
          <label key={key} className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">
              {label}
            </span>

            <input
              value={String(form[key as keyof UpdateSettingsPayload] ?? '')}
              onChange={(e) =>
                updateField(
                  key as keyof UpdateSettingsPayload,
                  e.target.value,
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </label>
        ))}
      </div>
    </div>
  );
}