import { useState } from 'react';
import { toast } from 'sonner';

import { api } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';

type LoginResponse = {
  accessToken?: string;
  access_token?: string;
  token?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
  };
};

export function LoginPage() {
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('salem@example.com');
  const [password, setPassword] = useState('Admin@123456');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);

      const { data } = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      console.log(data);

      const token =
        data.accessToken ||
        data.access_token ||
        data.token;
      
      console.log('TOKEN =', token);
      
      if (!token) {
        toast.error('Token not found');
        return;
      }
      
      login(token, data.user);
      toast.success('Logged in successfully');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-bold text-slate-950">
              IR
            </div>
            <h1 className="text-2xl font-bold">Al Iman Rouh Admin</h1>
            <p className="mt-2 text-sm text-slate-300">
              Sign in to manage packages, bookings, and messages.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-emerald-400"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="admin@alimanrouh.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-emerald-400"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="••••••••"
              />
            </div>

            <button
              className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}