import { useState } from 'react';
import type { PackageFormValues } from '../types';

type Props = {
  initialValues?: Partial<PackageFormValues>;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (values: PackageFormValues) => void;
  isSubmitting?: boolean;
};

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        placeholder="Package title"
        value={values.title}
        onChange={(e) => setValues({ ...values, title: e.target.value })}
      />

      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        placeholder="Price"
        type="number"
        value={values.price}
        onChange={(e) =>
          setValues({ ...values, price: Number(e.target.value) })
        }
      />

      <input
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        placeholder="Duration days"
        type="number"
        value={values.duration ?? ''}
        onChange={(e) =>
          setValues({
            ...values,
            duration: e.target.value ? Number(e.target.value) : undefined,
          })
        }
      />

      <textarea
        className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        placeholder="Description"
        value={values.description}
        onChange={(e) =>
          setValues({ ...values, description: e.target.value })
        }
      />

      {/* <input
        type="file"
        accept="image/*"
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white"
        onChange={(e) =>
          setValues({
            ...values,
            image: e.target.files?.[0] ?? null,
          })
        }
      /> */}

      <label className="flex items-center gap-3 text-slate-300">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) =>
            setValues({ ...values, isActive: e.target.checked })
          }
        />
        Active package
      </label>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-700 px-5 py-2 text-slate-300"
        >
          Cancel
        </button>

        <button
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-500 px-5 py-2 font-semibold text-slate-950 disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}