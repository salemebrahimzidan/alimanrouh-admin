import {
  Loader2,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react';
import type { CreateUserPayload, UserRole } from '../api/users.api';

type UserFormProps = {
  values: CreateUserPayload;
  isEditing: boolean;
  isSubmitting?: boolean;
  onChange: (values: CreateUserPayload) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const inputClassName =
  'w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-base';

const roleOptions: Array<{
  value: UserRole;
  label: string;
  description: string;
  icon: typeof Shield;
}> = [
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Manage packages, bookings, and messages',
    icon: Shield,
  },
  {
    value: 'SUPER_ADMIN',
    label: 'Super Admin',
    description: 'Full access including user management',
    icon: ShieldCheck,
  },
];

export default function UserForm({
  values,
  isEditing,
  isSubmitting,
  onChange,
  onCancel,
  onSubmit,
}: UserFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="user-name"
          className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          <User size={15} className="text-slate-500" />
          Full name
        </label>
        <input
          id="user-name"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          placeholder="e.g. Salem Ebrahim"
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label
          htmlFor="user-email"
          className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
        >
          <Mail size={15} className="text-slate-500" />
          Email address
        </label>
        <input
          id="user-email"
          value={values.email}
          onChange={(e) => onChange({ ...values, email: e.target.value })}
          placeholder="admin@alimanrouh.com"
          type="email"
          className={inputClassName}
          required
        />
      </div>

      {!isEditing && (
        <div>
          <label
            htmlFor="user-password"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
          >
            <Lock size={15} className="text-slate-500" />
            Password
          </label>
          <input
            id="user-password"
            value={values.password}
            onChange={(e) => onChange({ ...values, password: e.target.value })}
            placeholder="Minimum 8 characters"
            type="password"
            className={inputClassName}
            required
            minLength={8}
          />
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-medium text-slate-300">Role</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = values.role === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...values, role: option.value })}
                className={`rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/10 shadow-sm shadow-emerald-500/10'
                    : 'border-slate-700 bg-slate-950 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-lg p-2 ${
                      isSelected
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
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
              {isEditing ? 'Updating...' : 'Saving...'}
            </>
          ) : isEditing ? (
            'Update User'
          ) : (
            'Create User'
          )}
        </button>
      </div>
    </form>
  );
}
