import { FormProvider } from 'react-hook-form';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import { AuthInput } from '@/features/auth/ui';
import { useLogin } from '@/features/auth/model';

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
        <AnimatePresence>
          {!username && !password && !isAnyFieldFocused && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.8,
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute -top-1 left-[135px] -translate-x-1/2 bg-white rounded-full shadow-xl pl-7 pr-9 py-2 flex items-center gap-2 text-md after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white"
            >
              <MegaphoneIcon className="w-5" />
              <p>3초만에 시작하기</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
