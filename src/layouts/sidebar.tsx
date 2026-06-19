import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  Settings,
  Users,
} from 'lucide-react';

import { useAuthStore } from '../store/auth.store';

type Page = 'dashboard' | 'packages' | 'bookings' | 'messages' | 'users' | 'settings';

type SidebarProps = {
  activePage: Page;
  onChangePage: (page: Page) => void;
};

const menu = [
  { key: 'dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { key: 'packages', icon: Package, title: 'Packages' },
  { key: 'bookings', icon: CalendarCheck, title: 'Bookings' },
  { key: 'messages', icon: Mail, title: 'Messages' },
  { key: 'users', icon: Users, title: 'Users' },
  { key: 'settings', icon: Settings, title: 'Settings' },
] as const;

export default function Sidebar({ activePage, onChangePage }: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Al Iman Rouh</h1>
        <p className="mt-1 text-sm text-slate-400">Admin Panel</p>
      </div>

      <div className="flex-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onChangePage(item.key)}
              className={`mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}