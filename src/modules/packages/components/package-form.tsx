import {
  Clock,
  DollarSign,
  FileText,
  ImagePlus,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Type,
} from 'lucide-react';
import { useState } from 'react';
import type { PackageFormValues } from '../types';

type Props = {
  initialValues?: Partial<PackageFormValues>;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (values: PackageFormValues) => void;
  isSubmitting?: boolean;
};

const inputClassName =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-base';

export default function PackageForm({
  initialValues,
  submitLabel = 'Save Package',
  onCancel,
  onSubmit,
  isSubmitting,
}: Props) {
  const [values, setValues] = useState<PackageFormValues>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    price: initialValues?.price ?? 0,
    duration: initialValues?.duration,
    isActive: initialValues?.isActive ?? true,
    image: null,
  });

  const [imageName, setImageName] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="package-title"
          className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          <Type size={15} className="text-slate-500" />
          Package title
        </label>
        <input
          id="package-title"
          className={inputClassName}
          placeholder="e.g. Umrah Premium Package"
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="package-price"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
          >
            <DollarSign size={15} className="text-slate-500" />
            Price (SAR)
          </label>
          <input
            id="package-price"
            className={inputClassName}
            placeholder="0"
            type="number"
            min={0}
            value={values.price || ''}
            onChange={(e) =>
              setValues({ ...values, price: Number(e.target.value) })
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="package-duration"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
          >
            <Clock size={15} className="text-slate-500" />
            Duration (days)
          </label>
          <input
            id="package-duration"
            className={inputClassName}
            placeholder="Optional"
            type="number"
            min={1}
            value={values.duration ?? ''}
            onChange={(e) =>
              setValues({
                ...values,
                duration: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="package-description"
          className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          <FileText size={15} className="text-slate-500" />
          Description
        </label>
        <textarea
          id="package-description"
          className={`${inputClassName} min-h-28 resize-y`}
          placeholder="Describe what is included in this package..."
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
          <ImagePlus size={15} className="text-slate-500" />
          Package image
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/50 px-4 py-6 transition hover:border-emerald-500/40 hover:bg-slate-950">
          <ImagePlus size={24} className="text-slate-500" />
          <span className="mt-2 text-sm font-medium text-slate-300">
            {imageName ?? 'Click to upload image'}
          </span>
          <span className="mt-1 text-xs text-slate-500">PNG, JPG up to 5MB</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setValues({ ...values, image: file });
              setImageName(file?.name ?? null);
            }}
          />
        </label>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-white">Active package</p>
          <p className="text-xs text-slate-500">
            Visible to customers on the website
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={values.isActive}
          onClick={() =>
            setValues({ ...values, isActive: !values.isActive })
          }
          className={`rounded-full p-1 transition ${
            values.isActive ? 'text-emerald-400' : 'text-slate-500'
          }`}
        >
          {values.isActive ? (
            <ToggleRight size={32} />
          ) : (
            <ToggleLeft size={32} />
          )}
        </button>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
