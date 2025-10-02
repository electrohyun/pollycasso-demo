import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/features/auth/lib';
import type { LoginFormValues } from '@/features/auth/lib';
import { useAuthStore } from '@/features/auth/model';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isAnyFieldFocused, setIsAnyFieldFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const { handleSubmit, watch } = methods;

  const username = watch('username');
  const password = watch('password');

  const onSubmit = async (data: { username: string; password: string }) => {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      setErrorMessage(error.message);
      return;
    }

    const result = await res.json();

    setAuth({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    setErrorMessage(null);
    navigate('/welcome');
  };

  return {
    methods,
    handleSubmit,
    username,
    password,
    isAnyFieldFocused,
    setIsAnyFieldFocused,
    showPassword,
    setShowPassword,
    errorMessage,
    onSubmit,
  };
};
