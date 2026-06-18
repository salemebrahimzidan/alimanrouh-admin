import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';

export default function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-900 px-8">
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          placeholder="Search..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none focus:border-emerald-500"
        />
      </div>

      <div className="flex items-center gap-5">
        <Bell className="text-slate-300" />

        <div className="text-right">
          <p className="font-semibold text-white">
            {user?.name}
          </p>

          <p className="text-sm text-slate-400">
            {user?.email}
          </p>
        </div>
      </div>
    </header>
  );
}