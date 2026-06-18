import {
    LayoutDashboard,
    Package,
    CalendarCheck,
    Mail,
    Users,
    Settings,
    LogOut,
  } from 'lucide-react';
  
  import { useAuthStore } from '../store/auth.store';
  
  const menu = [
    { icon: LayoutDashboard, title: 'Dashboard' },
    { icon: Package, title: 'Packages' },
    { icon: CalendarCheck, title: 'Bookings' },
    { icon: Mail, title: 'Messages' },
    { icon: Users, title: 'Users' },
    { icon: Settings, title: 'Settings' },
  ];
  
  export default function Sidebar() {
    const logout = useAuthStore((s) => s.logout);
  
    return (
      <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-6">
          <h1 className="text-2xl font-bold text-white">
            Al Iman Rouh
          </h1>
  
          <p className="mt-1 text-sm text-slate-400">
            Admin Panel
          </p>
        </div>
  
        <div className="flex-1 p-4">
          {menu.map((item) => {
            const Icon = item.icon;
  
            return (
              <button
                key={item.title}
                className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
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