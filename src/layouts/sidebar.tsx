import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  Settings,
  Users,
  X,
} from 'lucide-react';

import { useAuthStore } from '../store/auth.store';

export type Page =
  | 'dashboard'
  | 'packages'
  | 'bookings'
  | 'messages'
  | 'users'
  | 'settings';

type SidebarProps = {
  activePage: Page;
  onChangePage: (page: Page) => void;
  isOpen: boolean;
  onClose: () => void;
};

const menu = [
  { key: 'dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { key: 'packages', icon: Package, title: 'Packages' },
  { key: 'bookings', icon: CalendarCheck, title: 'Bookings' },
  { key: 'messages', icon: Mail, title: 'Messages' },
  { key: 'users', icon: Users, title: 'Users' },
  { key: 'settings', icon: Settings, title: 'Settings' },
] as const;

export default function Sidebar({
  activePage,
  onChangePage,
  isOpen,
  onClose,
}: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);

  function handleNavigate(page: Page) {
    onChangePage(page);
    onClose();
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between border-b border-slate-800 p-6">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Al Iman Rouh
            </h1>
            <p className="mt-1 text-sm text-slate-400">Admin Panel</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleNavigate(item.key)}
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

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-label="Close menu overlay"
        />
      )}
    </>
  );
}
