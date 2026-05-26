import kakaoIcon from '@/assets/kakao.svg';
import { Button } from '@/shared/ui/Button';
import { showToast } from '@/shared/ui/Toast';
import { navigateToSocialLogin } from '../lib/auth';

export const KakaoLoginButton = () => {
  const handleClick = () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      showToast.info('데모에서는 게스트 로그인만 가능합니다.');
      return;
    }

    navigateToSocialLogin('kakao');
  };

  return (
    <Button
      variant="kakao"
      className="w-full justify-between hover:underline"
      onClick={handleClick}
    >
      <img src={kakaoIcon} className="w-6" alt="카카오" />
      <p className="text-lg">카카오 로그인</p>
      <div className="w-6" />
    </Button>
  );
};
