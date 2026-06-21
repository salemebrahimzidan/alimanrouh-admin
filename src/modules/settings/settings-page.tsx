import {
  Globe2,
  ImageIcon,
  LayoutTemplate,
  Loader2,
  Mail,
  MapPinned,
  PhoneCall,
  Save,
  Share2,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState, type ComponentType } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  XIcon,
  YoutubeIcon,
} from './components/settings-icons';

import {
  updateSettings,
  type UpdateSettingsPayload,
} from './api/settings.api';
import { useSettings } from './hooks/use-settings';

const inputClassName =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-base';

type SettingsIcon = LucideIcon | ComponentType<{ size?: number; className?: string }>;

type FieldConfig = {
  key: keyof UpdateSettingsPayload;
  label: string;
  placeholder: string;
  icon: SettingsIcon;
  iconClassName: string;
  type?: string;
  multiline?: boolean;
  preview?: boolean;
  maxLength?: number;
  span?: 'full';
};

type SectionConfig = {
  title: string;
  description: string;
  sectionIcon: LucideIcon;
  sectionIconClassName: string;
  fields: FieldConfig[];
  columns?: 'one' | 'two';
};

const sections: SectionConfig[] = [
  {
    title: 'Website',
    description: 'General site identity and branding',
    sectionIcon: Globe2,
    sectionIconClassName: 'bg-emerald-500/10 text-emerald-400',
    columns: 'two',
    fields: [
      {
        key: 'siteName',
        label: 'Site name',
        placeholder: 'Al Iman Rouh',
        icon: Globe2,
        iconClassName: 'bg-emerald-500/10 text-emerald-400',
      },
      {
        key: 'logo',
        label: 'Logo URL',
        placeholder: 'https://example.com/logo.png',
        icon: ImageIcon,
        iconClassName: 'bg-violet-500/10 text-violet-400',
        preview: true,
      },
      {
        key: 'heroImage',
        label: 'Hero image URL',
        placeholder: 'https://example.com/hero.jpg',
        icon: LayoutTemplate,
        iconClassName: 'bg-sky-500/10 text-sky-400',
        preview: true,
      },
    ],
  },
  {
    title: 'Contact',
    description: 'How customers can reach you',
    sectionIcon: PhoneCall,
    sectionIconClassName: 'bg-sky-500/10 text-sky-400',
    columns: 'two',
    fields: [
      {
        key: 'email',
        label: 'Email',
        placeholder: 'info@alimanrouh.com',
        icon: Mail,
        iconClassName: 'bg-blue-500/10 text-blue-400',
        type: 'email',
      },
      {
        key: 'phone',
        label: 'Phone',
        placeholder: '+966 50 000 0000',
        icon: PhoneCall,
        iconClassName: 'bg-emerald-500/10 text-emerald-400',
        type: 'tel',
      },
      {
        key: 'whatsapp',
        label: 'WhatsApp',
        placeholder: '+966 50 000 0000',
        icon: WhatsAppIcon,
        iconClassName: 'bg-green-500/10 text-green-400',
        type: 'tel',
      },
      {
        key: 'address',
        label: 'Address',
        placeholder: 'City, Country',
        icon: MapPinned,
        iconClassName: 'bg-amber-500/10 text-amber-400',
        multiline: true,
        maxLength: 500,
      },
    ],
  },
  {
    title: 'Social media',
    description: 'Links to your social profiles',
    sectionIcon: Share2,
    sectionIconClassName: 'bg-pink-500/10 text-pink-400',
    columns: 'two',
    fields: [
      {
        key: 'facebook',
        label: 'Facebook',
        placeholder: 'https://facebook.com/...',
        icon: FacebookIcon,
        iconClassName: 'bg-blue-500/10 text-blue-400',
        type: 'url',
      },
      {
        key: 'instagram',
        label: 'Instagram',
        placeholder: 'https://instagram.com/...',
        icon: InstagramIcon,
        iconClassName: 'bg-pink-500/10 text-pink-400',
        type: 'url',
      },
      {
        key: 'youtube',
        label: 'YouTube',
        placeholder: 'https://youtube.com/...',
        icon: YoutubeIcon,
        iconClassName: 'bg-red-500/10 text-red-400',
        type: 'url',
      },
      {
        key: 'twitter',
        label: 'X / Twitter',
        placeholder: 'https://x.com/...',
        icon: XIcon,
        iconClassName: 'bg-slate-500/10 text-slate-300',
        type: 'url',
      },
    ],
  },
];

function isValidImageUrl(url: string) {
  if (!url.trim()) return false;
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || url.includes('http');
  } catch {
    return false;
  }
}

type SettingsSectionProps = {
  section: SectionConfig;
  form: UpdateSettingsPayload;
  onFieldChange: (key: keyof UpdateSettingsPayload, value: string) => void;
};

function SettingsSubsection({ section, form, onFieldChange }: SettingsSectionProps) {
  const gridClass =
    section.columns === 'two'
      ? 'grid grid-cols-1 gap-5 sm:grid-cols-2'
      : 'flex flex-col gap-5';

  return (
    <div className="border-t border-slate-800 px-4 py-6 first:border-t-0 first:pt-4 sm:px-6">
      <div className={gridClass}>
        {section.fields.map((field) => {
          const Icon = field.icon;
          const value = String(form[field.key] ?? '');
          const showPreview = field.preview && isValidImageUrl(value);

          return (
            <div
              key={field.key}
              className={field.span === 'full' ? 'sm:col-span-2' : undefined}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <label
                  htmlFor={field.key}
                  className="flex w-full shrink-0 items-center gap-2.5 text-sm font-medium text-slate-300 sm:w-36 md:w-40"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${field.iconClassName}`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="truncate">{field.label}</span>
                </label>

                <div className="min-w-0 flex-1">
                  {field.multiline ? (
                    <textarea
                      id={field.key}
                      value={value}
                      onChange={(e) =>
                        onFieldChange(
                          field.key,
                          e.target.value.slice(0, field.maxLength ?? undefined),
                        )
                      }
                      placeholder={field.placeholder}
                      rows={1}
                      maxLength={field.maxLength}
                      className={`${inputClassName} h-12 min-h-12 w-full resize-none overflow-y-auto leading-normal`}
                    />
                  ) : (
                    <input
                      id={field.key}
                      type={field.type ?? 'text'}
                      value={value}
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className={inputClassName}
                    />
                  )}

                  {field.maxLength != null && (
                    <p
                      className={`mt-1.5 text-right text-xs tabular-nums ${
                        value.length >= field.maxLength
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {value.length}/{field.maxLength}
                    </p>
                  )}
                </div>
              </div>

              {showPreview && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <p className="mb-2 text-xs text-slate-500">Preview</p>
                  <img
                    src={value}
                    alt={field.label}
                    className={`rounded-lg object-cover ${
                      field.key === 'logo'
                        ? 'h-16 w-auto max-w-[200px]'
                        : 'h-36 w-full'
                    }`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type SettingsFormCardProps = {
  form: UpdateSettingsPayload;
  onFieldChange: (key: keyof UpdateSettingsPayload, value: string) => void;
  onReset: () => void;
  isSaving: boolean;
};

function SettingsFormCard({
  form,
  onFieldChange,
  onReset,
  isSaving,
}: SettingsFormCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="flex justify-end gap-3 border-b border-slate-800 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onReset}
          disabled={isSaving}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-60"
        >
          Reset changes
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Settings
            </>
          )}
        </button>
      </div>

      {sections.map((section) => (
        <SettingsSubsection
          key={section.title}
          section={section}
          form={form}
          onFieldChange={onFieldChange}
        />
      ))}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex justify-end gap-3">
        <div className="h-10 w-32 rounded-xl bg-slate-800" />
        <div className="h-10 w-36 rounded-xl bg-slate-800" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((field) => (
          <div key={field} className="h-12 rounded-xl bg-slate-800" />
        ))}
      </div>
    </div>
  );
}

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

  function resetForm() {
    if (!data) return;

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate(form);
  }

  const isSaving = mutation.isPending;

  return (
    <div>
      {isError && (
        <div className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-200 sm:p-5">
          Failed to load settings.
        </div>
      )}

      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <form id="settings-form" onSubmit={handleSubmit}>
          <SettingsFormCard
            form={form}
            onFieldChange={updateField}
            onReset={resetForm}
            isSaving={isSaving}
          />
        </form>
      )}
    </div>
  );
}
