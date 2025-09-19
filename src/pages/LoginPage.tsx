import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import title from '@/assets/title.svg';
import kakao from '@/assets/kakao.svg';
import google from '@/assets/google.svg';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormValues>();

  const username = watch('username');
  const password = watch('password');

  const onSubmit = (data: LoginFormValues) => {
    console.log('로그인 데이터:', data);
    navigate('/welcome');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-start items-center w-[690px] min-h-[650px] rounded-lg bg-white/30">
        <img src={title} className="w-full max-w-[405px] mx-auto mt-10 mb-4" />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[470px] flex flex-col items-center"
        >
          <div
            className={clsx(
              'relative w-[470px] mt-3 rounded-xl border bg-white transition-all duration-200',
              focusedField === 'username'
                ? 'ring-2 ring-[#419341] border-transparent'
                : 'border-gray-300',
              errors.username && 'border-red-500 ring-red-500',
            )}
          >
            <input
              type="text"
              autoComplete="off"
              id="username"
              {...register('username', { required: true })}
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
              className="w-[420px] pr-10 px-6 pt-[20px] pb-[16px] bg-transparent focus:outline-none"
            />
            <label
              htmlFor="username"
              className={clsx(
                'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
                {
                  'text-xs text-black top-[6px]':
                    focusedField === 'username' || username,
                  'text-lg text-black top-[16px]': !(
                    focusedField === 'username' || username
                  ),
                },
              )}
            >
              아이디
            </label>
          </div>
          {errors.username && (
            <p className="w-full text-left mt-2 text-red-500 text-xs">
              - 아이디를 입력해주세요
            </p>
          )}

          <div
            className={clsx(
              'relative w-[470px] mt-3 rounded-xl border bg-white transition-all duration-200',
              focusedField === 'password'
                ? 'ring-2 ring-[#419341] border-transparent'
                : 'border-gray-300',
              errors.password && 'border-red-500 ring-red-500',
            )}
          >
            <input
              type="password"
              autoComplete="off"
              id="password"
              {...register('password', { required: true })}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className="w-[420px] pr-10 px-6 pt-[20px] pb-[16px] bg-transparent focus:outline-none"
            />
            <label
              htmlFor="password"
              className={clsx(
                'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
                {
                  'text-xs text-black top-[6px]':
                    focusedField === 'password' || password,
                  'text-lg text-black top-[16px]': !(
                    focusedField === 'password' || password
                  ),
                },
              )}
            >
              비밀번호
            </label>
          </div>
          {errors.password && (
            <p className="w-full text-left mt-2 text-red-500 text-xs">
              - 비밀번호를 입력해주세요
            </p>
          )}

          <button
            type="submit"
            className="bg-[#003D00] text-white rounded-xl p-4 my-4 w-[470px] hover:bg-green-600 transition-colors duration-200 text-2xl "
          >
            로그인
          </button>
        </form>

        <hr className="w-[470px] border border-[#419341]" />

        <div className="relative w-[470px] mt-4">
          <AnimatePresence>
            {!username && !password && !focusedField && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -20,
                  scale: 0.8,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="absolute -top-10 left-32 -translate-x-1/2 
                   bg-white rounded-full shadow-xl pl-7 pr-9 py-2 
                   flex items-center gap-2 text-md
                   after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
                   after:border-8 after:border-transparent after:border-t-white"
              >
                <MegaphoneIcon className="w-5" />
                <p>3초만에 시작하기</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => navigate('/welcome')}
            className="flex justify-between bg-[#FEE500] rounded-md py-4 w-full transition-colors duration-200 hover:underline"
          >
            <img src={kakao} className="mx-4 w-6" />
            <p className="text-lg">카카오 로그인</p>
            <div className="mx-4 w-6" />
          </button>
        </div>

        <button
          onClick={() => navigate('/welcome')}
          className="flex justify-between bg-white rounded-md py-4 mt-4 w-[470px] transition-colors duration-200 hover:underline"
        >
          <img src={google} className="mx-4 w-6" />
          <p className="text-lg">Google 로그인</p>
          <div className="mx-4 w-6" />
        </button>

        <div className="flex justify-center items-center mt-6">
          <p className="text-lg">계정이 없으신가요?</p>
          <Link
            to="/signup"
            className="ml-2 text-2xl font-semibold text-[#329A6A] hover:underline"
          >
            가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
