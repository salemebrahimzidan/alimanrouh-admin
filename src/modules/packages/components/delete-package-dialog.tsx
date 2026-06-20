import { AlertTriangle, X } from 'lucide-react';
import type { PackageItem } from '../api/packages.api';

type Props = {
  packageItem: PackageItem | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeletePackageDialog({
  packageItem,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  if (!packageItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-red-500/10 p-3 text-red-400">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Delete Package
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-slate-300">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-white">
            {packageItem.title}
          </span>
          ?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-slate-700 px-5 py-2 text-slate-300 hover:bg-slate-800 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete Package'}
          </button>
        </div>
      </div>
    </div>
  );
}