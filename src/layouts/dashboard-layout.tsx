import { useState } from 'react';
import MessagesPage from '../modules/messages/messages-page';
import {
  CalendarCheck,
  Mail,
  Package,
  Users,
} from 'lucide-react';
import SettingsPage from '../modules/settings/settings-page';
import BookingsPage from '../modules/bookings/bookings-page';
import { useDashboard } from '../modules/dashboard/hooks/use-dashboard';
import PackagesPage from '../modules/packages/packages-page';
import Header from './header';
import Sidebar from './sidebar';
import UsersPage from '../modules/users/users-page';

type Page =
  | 'dashboard'
  | 'packages'
  | 'bookings'
  | 'messages'
  | 'users'
  | 'settings';

const statsConfig = [
  { key: 'packages', title: 'Packages', icon: Package },
  { key: 'bookings', title: 'Bookings', icon: CalendarCheck },
  { key: 'unreadMessages', title: 'Unread Messages', icon: Mail },
  { key: 'users', title: 'Users', icon: Users },
] as const;

function DashboardHome() {
  const { data, isLoading, isError } = useDashboard();

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="mt-2 text-slate-400">
          Overview of packages, bookings, messages, and users.
        </p>
      </div>

      {isError && (
        <div className="mb-6 rounded-2xl border border-red-900 bg-red-950/40 p-5 text-red-200">
          Failed to load dashboard data.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        {statsConfig.map((item) => {
          const Icon = item.icon;
          const value = data?.counts?.[item.key] ?? 0;

          return (
            <div
              key={item.key}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-slate-400">{item.title}</p>
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="mt-4 text-4xl font-bold text-white">
                {isLoading ? '...' : value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-xl font-semibold text-white">
            Latest Bookings
          </h3>

          <div className="space-y-4">
            {data?.latestBookings?.length ? (
              data.latestBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">
                      {booking.fullName}
                    </p>
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                      {booking.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {booking.phone} • {booking.package?.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                {isLoading ? 'Loading...' : 'No bookings yet.'}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="mb-5 text-xl font-semibold text-white">
            Latest Messages
          </h3>

          <div className="space-y-4">
            {data?.latestMessages?.length ? (
              data.latestMessages.map((message: any) => (
                <div
                  key={message.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{message.name}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        message.isRead
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {message.isRead ? 'Read' : 'Unread'}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {message.email}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                    {message.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                {isLoading ? 'Loading...' : 'No messages yet.'}
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default function DashboardLayout() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          {activePage === 'dashboard' && <DashboardHome />}
          {activePage === 'packages' && <PackagesPage />}
          {activePage === 'bookings' && <BookingsPage />}
          {activePage === 'messages' && <MessagesPage />}
          {activePage === 'users' && <UsersPage />}
          {activePage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}