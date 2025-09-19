import { Outlet, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import background from '@/assets/background.svg';

const DARK_PAGES = ['/login', '/signup'];

const RootLayout = () => {
  const { pathname } = useLocation();

  const isDark = DARK_PAGES.includes(pathname);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ filter: `brightness(${isDark ? 1 : 0.8})` }}
        animate={{ filter: `brightness(${isDark ? 0.8 : 1})` }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage: `url(${background})`,
        }}
      />

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
