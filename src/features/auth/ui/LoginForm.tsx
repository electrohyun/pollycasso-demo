import { FormProvider } from 'react-hook-form';
import clsx from 'clsx';
import { AuthInput } from '@/features/auth/ui';
import { useLogin } from '@/features/auth/model';
import { SocialGuide } from './SocialGuide';

interface LoginFormValues {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const {
    methods,
    handleSubmit,
    isValid,
    username,
    password,
    isAnyFieldFocused,
    setIsAnyFieldFocused,
    onSubmit,
  } = useLogin();

  return (
    <div className="w-[470px] flex flex-col items-center">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <AuthInput<LoginFormValues>
            name="username"
            label="아이디"
            validation={{ required: '아이디를 입력해주세요' }}
            onFocus={() => setIsAnyFieldFocused(true)}
            onBlur={() => setIsAnyFieldFocused(false)}
          />

          <AuthInput<LoginFormValues>
            name="password"
            label="비밀번호"
            type="password"
            validation={{ required: '비밀번호를 입력해주세요' }}
            onFocus={() => setIsAnyFieldFocused(true)}
            onBlur={() => setIsAnyFieldFocused(false)}
          />

          <button
            type="submit"
            disabled={!isValid}
            className={clsx(
              'text-white rounded-xl p-4 my-4 w-full transition-colors duration-200 text-2xl',
              isValid
                ? 'bg-[#003D00] hover:bg-green-600'
                : 'bg-[#7A9A7A] cursor-not-allowed',
            )}
          >
            로그인
          </button>
        </form>
      </FormProvider>

      <hr className="w-full border border-[#419341]" />

      <div className="relative w-full mt-4 h-10">
        <SocialGuide visible={!username && !password && !isAnyFieldFocused} />
      </div>
    </div>
  );
};
