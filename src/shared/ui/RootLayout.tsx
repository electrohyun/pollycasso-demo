import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { Background } from '@/assets';
import { BackgroundMain } from '@/assets';
import { Leaf } from '@/shared/ui';
import { createLeafData } from '@/shared/lib/leaf';
import type { LeafData } from '@/shared/lib/leaf';

const AUTH_DARK_PAGES = ['/login', '/signup'];
const WELCOME_PAGE = '/welcome';
const LEAF_COUNT = 8;

export const RootLayout = () => {
  const { pathname } = useLocation();
  const [leafData, setLeafData] = useState<LeafData[]>([]);
  const isAuthDark = AUTH_DARK_PAGES.includes(pathname);
  const isWelcome = pathname === WELCOME_PAGE;

  useEffect(() => {
    setLeafData(
      createLeafData(LEAF_COUNT, window.innerWidth, window.innerHeight),
    );
  }, []);

  let bgImage = Background;
  let brightness = 1;

  if (isAuthDark) {
    bgImage = Background;
    brightness = 0.8;
  } else if (isWelcome) {
    bgImage = Background;
    brightness = 1;
  } else {
    bgImage = BackgroundMain;
    brightness = 1;
  }

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage: `url(${bgImage})`,
          transition: 'background-image 2s ease-out, opacity 2s ease-out',
        }}
      />

      {leafData.map((leaf, index) => (
        <Leaf key={index} {...leaf} />
      ))}

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
