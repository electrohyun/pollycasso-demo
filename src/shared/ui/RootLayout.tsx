import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { Background } from '@/assets';
import { Leaf } from '@/shared/ui';
import { createLeafData } from '@/shared/lib/leaf';
import type { LeafData } from '@/shared/lib/leaf';

const DARK_PAGES = ['/login', '/signup'];
const LEAF_COUNT = 5;

export const RootLayout = () => {
  const { pathname } = useLocation();
  const isDark = DARK_PAGES.includes(pathname);

  const [leafData, setLeafData] = useState<LeafData[]>([]);

  useEffect(() => {
    setLeafData(
      createLeafData(LEAF_COUNT, window.innerWidth, window.innerHeight),
    );
  }, [pathname]);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      {/* 배경 */}
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ filter: `brightness(${isDark ? 1 : 0.8})` }}
        animate={{ filter: `brightness(${isDark ? 0.8 : 1})` }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${Background})` }}
      />

      {/* 낙엽 */}
      {leafData.map((leaf, index) => (
        <Leaf key={index} {...leaf} />
      ))}

      {/* 페이지 콘텐츠 */}
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
