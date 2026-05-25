import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from '@/entities/user';

const PrivateRoute = () => {
  const { accessToken } = useAuthStore();

  return accessToken ? <Outlet /> : <Outlet />;
};

export default PrivateRoute;
