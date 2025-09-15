import { Outlet } from 'react-router';
import { useLocation } from 'react-router';
import bgDark from '@/assets/bg_dark.svg';
import bgLight from '@/assets/bg_light.svg';

const RootLayout = () => {
  const location = useLocation();

  const darkBackgroundPages = ['/login'];
  const isDarkBackground = darkBackgroundPages.includes(location.pathname);
  const backgroundImage = isDarkBackground ? bgDark : bgLight;

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <Outlet />
    </div>
  );
};

export default RootLayout;
