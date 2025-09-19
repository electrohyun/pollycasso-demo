import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import clsx from 'clsx';
import title from '@/assets/title.svg';
import {
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface SignUpFormValues {
  username: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<SignUpFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const username = watch('username');
  const nickname = watch('nickname');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // 각 필드의 register 핸들러를 변수로 받아 onBlur와 병합
  const usernameReg = register('username', {
    required: true,
    minLength: 5,
    maxLength: 20,
    pattern: /^[a-z0-9_-]+$/,
  });
  const nicknameReg = register('nickname', {
    required: true,
    minLength: 2,
    maxLength: 30,
    pattern: /^[가-힣a-zA-Z0-9]+$/,
    validate: {
      maxKoreanChars: (value) => {
        const koreanChars = value.match(/[가-힣]/g) || [];
        return koreanChars.length <= 10;
      },
    },
  });
  const passwordReg = register('password', {
    required: true,
    minLength: 8,
    maxLength: 20,
    validate: {
      hasLetter: (v) => /[a-zA-Z]/.test(v),
      hasNumber: (v) => /\d/.test(v),
      hasSpecialChar: (v) => /[^a-zA-Z0-9]/.test(v),
    },
  });
  const confirmPasswordReg = register('confirmPassword', {
    required: true,
    validate: (value) => value === watch('password'),
  });

  const isFormValid = username && nickname && password && confirmPassword;

  const onSubmit = (data: SignUpFormValues) => {
    console.log('회원가입 정보:', data);
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
              {...usernameReg}
              onFocus={() => setFocusedField('username')}
              onBlur={(e) => {
                usernameReg.onBlur(e);
                setFocusedField(null);
              }}
              className="w-[420px] pr-10 px-6 pt-[20px] pb-[16px] bg-transparent focus:outline-none"
            />
            <label
              htmlFor="username"
              className={clsx(
                'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
                {
                  'text-xs text-[#8C8C8C] top-[6px]':
                    focusedField === 'username' || username,
                  'text-lg text-black top-[16px]': !(
                    focusedField === 'username' || username
                  ),
                },
              )}
            >
              아이디
            </label>
            <div
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-opacity duration-200',
                username ? 'opacity-100' : 'opacity-0',
              )}
            >
              {!touchedFields.username && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-gray-400" />
              )}
              {touchedFields.username && !errors.username && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-green-500" />
              )}
              {touchedFields.username && errors.username && (
                <XCircleIcon className="w-9 h-9 stroke-1 text-red-500" />
              )}
            </div>
          </div>
          {errors.username && (
            <p className="w-full text-left mt-2 text-red-500 text-xs">
              - 아이디는 5~20자 이내의 영어 소문자(a-z), 숫자(0-9), 특수문자(_,
              -)로 구성되어야 합니다.
            </p>
          )}

          <div
            className={clsx(
              'relative w-[470px] mt-3 rounded-xl border bg-white transition-all duration-200',
              focusedField === 'nickname'
                ? 'ring-2 ring-[#419341] border-transparent'
                : 'border-gray-300',
              errors.nickname && 'border-red-500 ring-red-500',
            )}
          >
            <input
              type="text"
              autoComplete="off"
              id="nickname"
              {...nicknameReg}
              onFocus={() => setFocusedField('nickname')}
              onBlur={(e) => {
                nicknameReg.onBlur(e);
                setFocusedField(null);
              }}
              className="w-[420px] pr-10 px-6 pt-[20px] pb-[16px] bg-transparent focus:outline-none"
            />
            <label
              htmlFor="nickname"
              className={clsx(
                'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
                {
                  'text-xs text-[#8C8C8C] top-[6px]':
                    focusedField === 'nickname' || nickname,
                  'text-lg text-black top-[16px]': !(
                    focusedField === 'nickname' || nickname
                  ),
                },
              )}
            >
              닉네임
            </label>
            <div
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-opacity duration-200',
                nickname ? 'opacity-100' : 'opacity-0',
              )}
            >
              {!touchedFields.nickname && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-gray-400" />
              )}
              {touchedFields.nickname && !errors.nickname && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-green-500" />
              )}
              {touchedFields.nickname && errors.nickname && (
                <XCircleIcon className="w-9 h-9 stroke-1 text-red-500" />
              )}
            </div>
          </div>
          {errors.nickname && (
            <p className="w-full text-left mt-2 text-red-500 text-xs">
              - 닉네임은 한글 10자, 영문/숫자 30자 이내로 구성되어야 합니다.
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
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              id="password"
              {...passwordReg}
              onFocus={() => setFocusedField('password')}
              onBlur={(e) => {
                passwordReg.onBlur(e);
                setFocusedField(null);
              }}
              className="w-[380px] px-6 pt-[20px] pb-[16px] bg-transparent focus:outline-none"
            />
            <label
              htmlFor="password"
              className={clsx(
                'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
                {
                  'text-xs text-[#8C8C8C] top-[6px]':
                    focusedField === 'password' || password,
                  'text-lg text-black top-[16px]': !(
                    focusedField === 'password' || password
                  ),
                },
              )}
            >
              비밀번호
            </label>

            <div
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2',
                'transition-opacity duration-500',
                password ? 'opacity-100' : 'opacity-0',
              )}
            >
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeIcon className="w-6 h-6 stroke-1 text-[#5A5A5A]" />
                ) : (
                  <EyeSlashIcon className="w-6 h-6 stroke-1 text-[#5A5A5A]" />
                )}
              </button>
              {!touchedFields.password && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-gray-400" />
              )}
              {touchedFields.password && !errors.password && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-green-500" />
              )}
              {touchedFields.password && errors.password && (
                <XCircleIcon className="w-9 h-9 stroke-1 text-red-500" />
              )}
            </div>
          </div>
          {errors.password && (
            <p className="w-full text-left mt-2 text-red-500 text-xs">
              - 비밀번호는 8~20자 이내의 영문자, 숫자, 특수문자를 각각 1자 이상
              포함해야 합니다.
            </p>
          )}
          <div
            className={clsx(
              'relative w-[470px] mt-3 rounded-xl border bg-white transition-all duration-200',
              focusedField === 'confirmPassword'
                ? 'ring-2 ring-[#419341] border-transparent'
                : 'border-gray-300',
              errors.confirmPassword && 'border-red-500 ring-red-500',
            )}
          >
            <input
              type={showConfirmPassword ? 'text' : 'password'} // 👈 토글
              autoComplete="off"
              id="confirmPassword"
              {...confirmPasswordReg}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={(e) => {
                confirmPasswordReg.onBlur(e);
                setFocusedField(null);
              }}
              className="w-[380px] px-6 pt-[20px] pb-[16px] bg-transparent focus:outline-none"
            />
            <label
              htmlFor="confirmPassword"
              className={clsx(
                'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
                {
                  'text-xs text-[#8C8C8C] top-[6px]':
                    focusedField === 'confirmPassword' || confirmPassword,
                  'text-lg text-black top-[16px]': !(
                    focusedField === 'confirmPassword' || confirmPassword
                  ),
                },
              )}
            >
              비밀번호 확인
            </label>

            <div
              className={clsx(
                'absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2',
                'transition-opacity duration-500',
                confirmPassword ? 'opacity-100' : 'opacity-0',
              )}
            >
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="w-6 h-6 stroke-1 text-[#5A5A5A]" />
                ) : (
                  <EyeSlashIcon className="w-6 h-6 stroke-1 text-[#5A5A5A]" />
                )}
              </button>

              {!touchedFields.confirmPassword && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-gray-400" />
              )}
              {touchedFields.confirmPassword && !errors.confirmPassword && (
                <CheckCircleIcon className="w-9 h-9 stroke-1 text-green-500" />
              )}
              {touchedFields.confirmPassword && errors.confirmPassword && (
                <XCircleIcon className="w-9 h-9 stroke-1 text-red-500" />
              )}
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="w-full text-left mt-2 text-red-500 text-xs">
              - 비밀번호가 일치하지 않습니다.
            </p>
          )}

          <hr className="my-7 w-[450px] border border-[#419341]" />

          <button
            type="submit"
            disabled={!isFormValid}
            className={clsx(
              'text-white rounded-xl p-4 mb-8 w-[450px] h-[80px] transition-colors duration-200 text-2xl',
              {
                'bg-[#003D00] hover:bg-green-600': isFormValid,
                'bg-[#7A917A] cursor-not-allowed': !isFormValid,
              },
            )}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
