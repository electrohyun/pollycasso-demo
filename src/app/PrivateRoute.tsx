import { Navigate, Outlet, useLocation } from 'react-router';

import { useAuthStore } from '@/entities/user';

const PrivateRoute = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
