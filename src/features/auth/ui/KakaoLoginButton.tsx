import kakaoIcon from '@/assets/kakao.svg';
import { Button } from '@/shared/ui/Button';

export const KakaoLoginButton = () => {
  const handleLogin = () => {
    const baseUrl = import.meta.env.VITE_SOCIAL_LOGIN_URL;
    window.location.href = `${baseUrl}/auth/kakao`;
  };

  return (
    <Button
      variant="kakao"
      className="w-full justify-between hover:underline"
      onClick={handleLogin}
    >
      <img src={kakaoIcon} className="w-6" alt="카카오" />
      <p className="text-lg">카카오 로그인</p>
      <div className="w-6" />
    </Button>
  );
};
