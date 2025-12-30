import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useAuthStore } from '@/entities/user';
import { parseAccessToken } from '@/shared/lib';
import { Spinner } from '@/shared/ui/Spinner';

const LoginCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (accessToken) {
      try {
        const decoded = parseAccessToken(accessToken);

        setAuth({
          user: {
            id: decoded.sub,
            nickname: decoded.nickname,
          },
          accessToken: accessToken,
        });

        navigate('/welcome', { replace: true });
      } catch (error) {
        alert('로그인 정보가 올바르지 않습니다.');
        navigate('/login', { replace: true });
      }
    } else {
      alert('소셜 로그인 처리에 실패했습니다.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <Spinner fixed transparent size="xl" message="소셜 로그인 중입니다..." />
  );
};

export default LoginCallbackPage;
