import { useState } from 'react';
import MessagesPage from '../modules/messages/messages-page';
import {
  ArrowRight,
  CalendarCheck,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Users,
} from 'lucide-react';
import SettingsPage from '../modules/settings/settings-page';
import BookingsPage from '../modules/bookings/bookings-page';
import { useDashboard } from '../modules/dashboard/hooks/use-dashboard';
import PackagesPage from '../modules/packages/packages-page';
import Header from './header';
import Sidebar, { type Page } from './sidebar';
import UsersPage from '../modules/users/users-page';

const statsConfig = [
  {
    key: 'packages',
    title: 'Packages',
    subtitle: 'Travel listings',
    icon: Package,
    accent: 'emerald',
  },
  {
    key: 'bookings',
    title: 'Bookings',
    subtitle: 'Customer requests',
    icon: CalendarCheck,
    accent: 'sky',
  },
  {
    key: 'unreadMessages',
    title: 'Unread Messages',
    subtitle: 'Needs attention',
    icon: Mail,
    accent: 'amber',
  },
  {
    key: 'users',
    title: 'Users',
    subtitle: 'Admin accounts',
    icon: Users,
    accent: 'violet',
  },
] as const;

const accentStyles = {
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-400',
    glow: 'bg-emerald-500/10',
    value: 'text-white',
  },
  sky: {
    icon: 'bg-sky-500/10 text-sky-400',
    glow: 'bg-sky-500/10',
    value: 'text-white',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-400',
    glow: 'bg-amber-500/10',
    value: 'text-white',
  },
  violet: {
    icon: 'bg-violet-500/10 text-violet-400',
    glow: 'bg-violet-500/10',
    value: 'text-white',
  },
} as const;

function getBookingStatusClass(status: string) {
  if (status === 'CONFIRMED') return 'bg-emerald-500/10 text-emerald-400';
  if (status === 'CANCELLED') return 'bg-red-500/10 text-red-400';
  return 'bg-yellow-500/10 text-yellow-400';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

type DashboardHomeProps = {
  onNavigate: (page: Page) => void;
};

function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const { data, isLoading, isError } = useDashboard();

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-400">{today}</p>
          <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            Dashboard
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
            Overview of packages, bookings, messages, and users.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-white"
          >
            <CalendarCheck size={16} />
            View bookings
          </button>
          <button
            type="button"
            onClick={() => onNavigate('messages')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-emerald-500/40 hover:text-white"
          >
            <MessageSquare size={16} />
            View messages
          </button>
        </div>
      </div>

      {isError && (
        <div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-200 sm:p-5 sm:text-base">
          Failed to load dashboard data.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {statsConfig.map((item) => {
          const Icon = item.icon;
          const styles = accentStyles[item.accent];
          const value = data?.counts?.[item.key] ?? 0;
          const isUnreadStat = item.key === 'unreadMessages' && value > 0;

          let extra: string | null = null;
          if (item.key === 'bookings' && data?.counts) {
            extra = `${data.counts.pendingBookings} pending`;
          }
          if (item.key === 'unreadMessages' && data?.counts) {
            extra = `${data.counts.messages} total messages`;
          }

          return (
            <button
              key={item.key}
              type="button"
              onClick={() =>
                onNavigate(
                  item.key === 'unreadMessages'
                    ? 'messages'
                    : item.key === 'packages'
                      ? 'packages'
                      : item.key === 'bookings'
                        ? 'bookings'
                        : 'users',
                )
              }
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-700 hover:bg-slate-900/80 sm:p-6"
            >
              <div
                className={`absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl ${styles.glow}`}
              />

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.subtitle}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${styles.icon}`}>
                  <Icon size={20} />
                </div>
              </div>

              <p
                className={`relative mt-4 text-3xl font-bold sm:text-4xl ${
                  isUnreadStat ? 'text-amber-400' : styles.value
                }`}
              >
                {isLoading ? (
                  <span className="inline-block h-9 w-12 animate-pulse rounded-lg bg-slate-800" />
                ) : (
                  value
                )}
              </p>

              {extra && !isLoading && (
                <p className="relative mt-2 text-xs text-slate-500">{extra}</p>
              )}

              <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition group-hover:text-emerald-400">
                Open
                <ArrowRight
                  size={14}
                  className="transition group-hover:translate-x-0.5"
                />
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <section className="flex max-h-112 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-500/10 p-2 text-sky-400">
                <CalendarCheck size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Latest Bookings</h3>
                <p className="text-xs text-slate-500">Recent customer requests</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-xl bg-slate-950"
                  />
                ))}
              </div>
            )}

            {!isLoading && data?.latestBookings?.length ? (
              data.latestBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">
                        {booking.fullName}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                        <Phone size={13} className="shrink-0 text-slate-500" />
                        <span className="truncate">{booking.phone}</span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getBookingStatusClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{booking.package?.title ?? 'No package'}</span>
                    {booking.travelDate && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>{formatDate(booking.travelDate)}</span>
                      </>
                    )}
                    {(booking.adults != null || booking.children != null) && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span>
                          {booking.adults ?? 0} Adults / {booking.children ?? 0}{' '}
                          Children
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : !isLoading ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-10 text-center">
                <CalendarCheck
                  size={28}
                  className="mx-auto text-slate-600"
                />
                <p className="mt-3 text-sm text-slate-500">No bookings yet.</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="flex max-h-112 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Latest Messages</h3>
                <p className="text-xs text-slate-500">Contact form inbox</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('messages')}
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl bg-slate-950"
                  />
                ))}
              </div>
            )}

            {!isLoading && data?.latestMessages?.length ? (
              data.latestMessages.map((message: any) => (
                <div
                  key={message.id}
                  className={`rounded-xl border bg-slate-950 p-4 transition hover:border-slate-700 ${
                    message.isRead
                      ? 'border-slate-800'
                      : 'border-amber-500/20 bg-amber-500/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                      {getInitials(message.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate font-semibold text-white">
                          {message.name}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            message.isRead
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {message.isRead ? 'Read' : 'Unread'}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-sm text-slate-400">
                        {message.email}
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : !isLoading ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-4 py-10 text-center">
                <MessageSquare
                  size={28}
                  className="mx-auto text-slate-600"
                />
                <p className="mt-3 text-sm text-slate-500">No messages yet.</p>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function navigateTo(page: Page) {
    setActivePage(page);
    setSidebarOpen(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar
        activePage={activePage}
        onChangePage={navigateTo}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {activePage === 'dashboard' && (
            <DashboardHome onNavigate={navigateTo} />
          )}
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
