import { Bell, Menu, Search } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user);

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 sm:h-20 sm:gap-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-md lg:max-w-sm xl:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            placeholder="Search..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-emerald-500 sm:py-3 sm:text-base"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          className="rounded-xl p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-semibold text-emerald-400">
            {initials || 'AD'}
          </div>

          <div className="min-w-0 text-right">
            <p className="truncate font-semibold text-white">{user?.name}</p>
            <p className="hidden truncate text-sm text-slate-400 md:block">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-400 sm:hidden">
          {initials || 'AD'}
        </div>
      </div>
    </header>
  );
}
