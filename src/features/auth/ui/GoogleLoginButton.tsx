import googleIcon from '@/assets/google.svg';
import { Button } from '@/shared/ui/Button';
import { showToast } from '@/shared/ui/Toast';
import { navigateToSocialLogin } from '../lib/auth';

export const GoogleLoginButton = () => {
  const handleClick = () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      showToast.info('데모에서는 게스트 로그인만 가능합니다.');
      return;
    }

    navigateToSocialLogin('google');
  };

  return (
    <Button
      variant="google"
      className="w-full justify-between hover:underline"
      onClick={handleClick}
    >
      <img src={googleIcon} className="w-6" alt="구글" />
      <p className="text-lg">Google 로그인</p>
      <div className="w-6" />
    </Button>
  );
};
