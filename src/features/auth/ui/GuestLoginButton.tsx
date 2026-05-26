import { useNavigate } from 'react-router';

import { loginAsPortfolioGuest } from '@/entities/user/model/portfolioUser';

export const GuestLoginButton = () => {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    loginAsPortfolioGuest();
    navigate('/', { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleGuestLogin}
      className="w-[470px] rounded-xl bg-[#EF5F52] p-4 text-2xl font-bold text-white transition-colors duration-200 hover:bg-[#d64538]"
    >
      게스트 로그인
    </button>
  );
};
