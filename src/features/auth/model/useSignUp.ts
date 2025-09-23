import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface SignUpFormValues {
  username: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

export const useSignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const methods = useForm<SignUpFormValues>({
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    formState: { isValid },
  } = methods;

  const passwordValue = watch('password');

  const onSubmit = (data: SignUpFormValues) => {
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
