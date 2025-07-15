import { z } from 'zod';
import validator from 'validator';
import { parsePhoneNumber } from 'libphonenumber-js';

// 공통 스키마 조각들
const emailSchema = z
  .string()
  .min(1, '이메일을 입력해주세요.')
  .refine((email) => validator.isEmail(email), {
    message: '올바른 이메일 형식으로 입력해주세요.',
  });

const passwordSchema = z
  .string()
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .max(64, '비밀번호는 최대 64자까지 가능합니다.')
  .refine(
    (password) => {
      // 대문자, 소문자, 숫자, 특수문자 중 2개 이상 포함
      const conditions = [
        /[A-Z]/.test(password), // 대문자
        /[a-z]/.test(password), // 소문자
        /\d/.test(password), // 숫자
        /[!@#$%^&*(),.?":{}|<>]/.test(password), // 특수문자
      ];
      return conditions.filter(Boolean).length >= 2;
    },
    {
      message: '대문자, 소문자, 숫자, 특수문자 중 2개 이상을 포함해야 합니다.',
    }
  );

const nameSchema = z
  .string()
  .min(1, '실명을 입력해주세요.')
  .min(2, '실명은 최소 2자 이상이어야 합니다.')
  .max(50, '실명은 최대 50자까지 가능합니다.')
  .refine(
    (name) => {
      // 한글만 있는 경우: 띄어쓰기 불가
      if (/^[가-힣]+$/.test(name)) return true;
      // 영문만 있는 경우: 띄어쓰기 허용 (First Last)
      if (/^[a-zA-Z\s]+$/.test(name)) return true;
      // 혼용 또는 기타 문자 불가
      return false;
    },
    {
      message: '한글은 띄어쓰기 없이, 영문은 띄어쓰기 가능합니다.',
    }
  );

const nicknameSchema = z
  .string()
  .min(1, '닉네임을 입력해주세요.')
  .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
  .max(20, '닉네임은 최대 20자까지 가능합니다.')
  .refine((nickname) => /^[가-힣a-zA-Z0-9]+$/.test(nickname), {
    message: '닉네임은 한글, 영문, 숫자만 사용 가능합니다.',
  });

const phoneSchema = z
  .string()
  .min(1, '전화번호를 입력해주세요.')
  .refine(
    (phone) => {
      try {
        const phoneNumber = parsePhoneNumber(phone, 'KR');
        return phoneNumber?.isValid() ?? false;
      } catch {
        return false;
      }
    },
    {
      message: '올바른 전화번호 형식으로 입력해주세요.',
    }
  );

// 회원가입 스키마
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordCheck: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    name: nameSchema,
    nickname: nicknameSchema,
    phone: phoneSchema,
    code: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordCheck'],
  });

// 로그인 스키마
export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// 프로필 수정 스키마 (비밀번호 제외)
export const profileUpdateSchema = z.object({
  name: nameSchema,
  nickname: nicknameSchema,
  phone: phoneSchema,
});

// 비밀번호 변경 스키마
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요.'),
    newPassword: passwordSchema,
    newPasswordCheck: z.string().min(1, '새 비밀번호 확인을 입력해주세요.'),
  })
  .refine((data) => data.newPassword === data.newPasswordCheck, {
    message: '새 비밀번호가 일치하지 않습니다.',
    path: ['newPasswordCheck'],
  });

// 타입 추출
export type SignupFormData = z.infer<typeof signupSchema>;
export type SigninFormData = z.infer<typeof signinSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// 비밀번호 강도 분석 유틸리티
export const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, conditions: [], isStrong: false };

  const conditions = [
    { name: '8자 이상', test: password.length >= 8 },
    { name: '대문자 포함', test: /[A-Z]/.test(password) },
    { name: '소문자 포함', test: /[a-z]/.test(password) },
    { name: '숫자 포함', test: /\d/.test(password) },
    { name: '특수문자 포함', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const metConditions = conditions.filter((condition) => condition.test);
  const strength = metConditions.length;
  const isStrong = strength >= 3; // 최소 3개 조건 만족

  return {
    strength,
    conditions,
    isStrong,
  };
};
