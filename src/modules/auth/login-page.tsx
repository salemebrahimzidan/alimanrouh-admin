import { useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Eye,
  EyeOff,
  Languages,
  Loader2,
  Lock,
  Mail,
  Package,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

import { api } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import {
  LOGIN_LANGUAGE_KEY,
  loginCopy,
  readLoginLanguage,
  type LoginLanguage,
} from './login-copy';

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

const featureIcons = [Package, CalendarCheck, Shield];

const languageOptions: Array<{ id: LoginLanguage; label: string }> = [
  { id: 'ar', label: 'العربية' },
  { id: 'en', label: 'English' },
];

const inputClassName =
  'w-full rounded-lg border border-slate-200 bg-white py-3 ps-11 pe-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1a5276] focus:ring-4 focus:ring-[#1a5276]/10';

function LanguageSwitcher({
  language,
  label,
  onChange,
}: {
  language: LoginLanguage;
  label: string;
  onChange: (language: LoginLanguage) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1">
      <span className="inline-flex items-center gap-1.5 px-2 text-slate-500">
        <Languages className="h-3.5 w-3.5" aria-hidden />
        <span className="text-xs font-medium">{label}</span>
      </span>
      <div className="inline-flex overflow-hidden rounded-full" role="group">
        {languageOptions.map((option) => {
          const active = option.id === language;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={active}
              className={
                active
                  ? 'inline-flex items-center gap-1 rounded-full bg-[#12263a] px-2.5 py-1 text-xs font-medium text-white'
                  : 'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
              }
            >
              {active ? <Check className="h-3 w-3" aria-hidden /> : null}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LoginPage() {
  const login = useAuthStore((state) => state.login);

  const [language, setLanguage] = useState<LoginLanguage>(readLoginLanguage);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const copy = loginCopy[language];

  function changeLanguage(next: LoginLanguage) {
    setLanguage(next);
    localStorage.setItem(LOGIN_LANGUAGE_KEY, next);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);

      const { data } = await api.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const token =
        data.accessToken ||
        data.access_token ||
        data.token;

      if (!token) {
        toast.error(copy.tokenMissing);
        return;
      }

      login(token, data.user);
      toast.success(copy.signedIn);
    } catch {
      toast.error(copy.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      lang={language}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#f4f6f8] text-slate-900 lg:grid lg:grid-cols-2"
    >
      <section className="relative hidden min-h-screen flex-col bg-[#07131f] text-white lg:flex">
        <div className="relative min-h-0 flex-1">
          <img
            src="/login-hero.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07131f]/20 via-transparent to-[#07131f]"
          />
        </div>

        <div className="shrink-0 px-8 pb-8 xl:px-12 xl:pb-10">
          <div className="max-w-md">
            <p className="text-sm leading-6 text-slate-300">{copy.intro}</p>

            <ul className="mt-6 space-y-4">
              {copy.features.map(({ title, description }, index) => {
                const Icon = featureIcons[index];

                return (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-100">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">
                        {title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-5 text-slate-300">
                        {description}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-[#f4f6f8] px-4 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#12263a] text-sm font-bold text-white">
                IR
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{copy.brand}</p>
                <p className="text-xs text-slate-500">{copy.admin}</p>
              </div>
            </div>

            <div className="ms-auto">
              <LanguageSwitcher
                language={language}
                label={copy.language}
                onChange={changeLanguage}
              />
            </div>
          </div>

          <p
            className={`text-xs font-medium text-[#1a5276] ${
              language === 'en' ? 'uppercase tracking-[0.18em]' : ''
            }`}
          >
            {copy.signInEyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {copy.welcome}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{copy.formIntro}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {copy.email}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="email"
                  className={inputClassName}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  placeholder="admin@alimanrouh.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {copy.password}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="password"
                  className={`${inputClassName} pe-11`}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={copy.passwordPlaceholder}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label={showPassword ? copy.hidePassword : copy.showPassword}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#12263a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1a3a56] focus:outline-none focus:ring-4 focus:ring-[#12263a]/15 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {copy.signingIn}
                </>
              ) : (
                <>
                  {copy.signIn}
                  <ArrowRight size={16} className="rtl:-scale-x-100" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs leading-5 text-slate-400">
            {copy.notice}
          </p>
        </div>
      </section>
    </main>
  );
}
