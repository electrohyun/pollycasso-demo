import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { lazy, Suspense } from 'react';
import Spinner from '@/shared/ui/Spinner';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const WelcomePage = lazy(() => import('@/pages/WelcomePage'));

const RootLayout = () => <Outlet />;

const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<Spinner message="페이지를 불러오는 중..." />}>
        <RootLayout />
      </Suspense>
    ),
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/welcome',
        element: <WelcomePage />,
      },
    ],
  },
]);

const Router = () => <RouterProvider router={router} />;

export default Router;
