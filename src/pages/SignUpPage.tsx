import { useNavigate } from 'react-router';
import { useState } from 'react';

import clsx from 'clsx';
import title from '@/assets/title.svg';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isFormValid = username && nickname && password && confirmPassword;

  const goToWelcomePage = () => {
    navigate('/welcome');
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center mb-4 w-[690px] h-[630px] rounded-lg bg-white/30">
        <img src={title} className="w-full max-w-[405px] mx-auto mb-4" />

        <div className="relative mb-3 w-[450px]">
          <input
            type="text"
            autoComplete="off"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-6 pt-[20px] pb-[16px] border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#419341] focus:border-transparent transition-all duration-200"
          />
          <label
            htmlFor="username"
            className={clsx(
              'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
              {
                'text-xs text-black bg-transparent top-[6px]':
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

        <div className="relative mb-3 w-[450px]">
          <input
            type="text"
            autoComplete="off"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onFocus={() => setFocusedField('nickname')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-6 pt-[20px] pb-[16px] border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#419341] focus:border-transparent transition-all duration-200"
          />
          <label
            htmlFor="nickname"
            className={clsx(
              'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
              {
                'text-xs text-black bg-transparent top-[6px]':
                  focusedField === 'nickname' || nickname,
                'text-lg text-black top-[16px]': !(
                  focusedField === 'nickname' || nickname
                ),
              },
            )}
          >
            닉네임
          </label>
        </div>

        <div className="relative mb-3 w-[450px]">
          <input
            type="password"
            autoComplete="off"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-6 pt-[20px] pb-[16px] border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#419341] focus:border-transparent transition-all duration-200"
          />
          <label
            htmlFor="password"
            className={clsx(
              'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
              {
                'text-xs text-black bg-transparent top-[6px]':
                  focusedField === 'password' || password,
                'text-lg text-black top-[16px]': !(
                  focusedField === 'password' || password
                ),
              },
            )}
          >
            패스워드
          </label>
        </div>

        <div className="relative mb-3 w-[450px]">
          <input
            type="password"
            autoComplete="off"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
            className="w-full px-6 pt-[20px] pb-[16px] border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#419341] focus:border-transparent transition-all duration-200"
          />
          <label
            htmlFor="confirmPassword"
            className={clsx(
              'absolute left-6 transition-all duration-200 pointer-events-none font-pretendard',
              {
                'text-xs text-black bg-transparent top-[6px]':
                  focusedField === 'confirmPassword' || confirmPassword,
                'text-lg text-black top-[16px]': !(
                  focusedField === 'confirmPassword' || confirmPassword
                ),
              },
            )}
          >
            패스워드 확인
          </label>
        </div>

        <hr className="my-4 w-[450px] border border-[#419341]" />

        <button
          onClick={goToWelcomePage}
          disabled={!isFormValid}
          className={clsx(
            'text-white rounded-xl p-4 mb-4 w-[450px] transition-colors duration-200 text-2xl',
            {
              'bg-[#003D00] hover:bg-green-600': isFormValid,
              'bg-[#7A917A] cursor-not-allowed': !isFormValid,
            },
          )}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SignUpPage;
