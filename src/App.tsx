import { LoginPage } from './modules/auth/login-page';
import DashboardLayout from './layouts/dashboard-layout';
import { useAuthStore } from './store/auth.store';

export default function App() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  return isAuthenticated ? (
    <DashboardLayout />
  ) : (
    <LoginPage />
  );
}