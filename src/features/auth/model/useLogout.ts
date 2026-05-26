import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user';
import { authQueries } from '../queries/authQueries';

export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const clearLocalAuthAndRedirect = () => {
    clearAuth();
    localStorage.removeItem('auth-storage');
    navigate('/login', { replace: true });
  };

  const { mutate: logout, isPending } = useMutation({
    ...authQueries.logout(),

    onSuccess: clearLocalAuthAndRedirect,

    onError: clearLocalAuthAndRedirect,
  });

  const handleLogout = () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      clearLocalAuthAndRedirect();
      return;
    }

    logout();
  };

  return { logout: handleLogout, isPending };
};
