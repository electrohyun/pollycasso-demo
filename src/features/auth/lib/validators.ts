import { z } from 'zod';

const usernameSchema = z
  .string()
  .min(
    5,
    '아이디는 5~20자 이내의 영어 소문자(a-z), 숫자(0-9), 특수문자(_, -)로 구성되어야 합니다.',
  )
  .max(
    20,
    '아이디는 5~20자 이내의 영어 소문자(a-z), 숫자(0-9), 특수문자(_, -)로 구성되어야 합니다.',
  )
  .regex(
    /^[a-z0-9_-]{5,20}$/,
    '아이디는 5~20자 이내의 영어 소문자(a-z), 숫자(0-9), 특수문자(_, -)로 구성되어야 합니다.',
  );

const nicknameSchema = z
  .string()
  .refine(
    (value) => {
      const hasKorean = /[가-힣]/.test(value);

      if (hasKorean) {
        return value.length <= 10;
      }

      return value.length <= 30;
    },
    {
      message: '닉네임은 한글 10자, 영문/숫자 30자 이내로 구성되어야 합니다.',
    },
  )
  .regex(
    /^[가-힣a-zA-Z0-9]+$/,
    '닉네임은 한글 10자, 영문/숫자 30자 이내로 구성되어야 합니다.',
  );

const passwordSchema = z
  .string()
  .min(
    8,
    '비밀번호는 8~20자이며, 영문자, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다.',
  )
  .max(
    20,
    '비밀번호는 8~20자이며, 영문자, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다.',
  )
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])[a-zA-Z\d[^a-zA-Z0-9]]{8,20}$/,
    '비밀번호는 8~20자이며, 영문자, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다.',
  );

export const validateUsername = (value: string) => {
  const result = usernameSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
};

export const validateNickname = (value: string) => {
  const result = nicknameSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
};

export const validatePassword = (value: string) => {
  const result = passwordSchema.safeParse(value);
  return result.success ? true : result.error.issues[0].message;
};
