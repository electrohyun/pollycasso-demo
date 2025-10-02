import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from '@/features/auth/lib';
import type { SignUpFormValues } from '@/features/auth/lib';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export const useSignUp = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    formState: { isValid },
  } = methods;

  const passwordValue = watch('password');

  const onSubmit = async (data: {
    username: string;
    nickname: string;
    password: string;
  }) => {
    const res = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.status === 500) {
      const error = await res.json();
      alert(error.message);
      return;
    }

    if (res.status === 409) {
      const error = await res.json();

      error.errors.forEach((err: { field: string; reason: string }) => {
        methods.setError(err.field as keyof typeof methods.formState.errors, {
          type: 'manual',
          message: err.reason,
        });
      });

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
    isValid,
    passwordValue,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    onSubmit,
  };
};
