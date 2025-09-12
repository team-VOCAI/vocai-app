'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ContainerX from '@/components/ContainerX';
import { signinSchema, type SigninFormData } from '@/lib/schemas/auth';
import { authAPI, ApiError } from '@/lib/api';
import { redirectAfterLogin, setRedirectUrl } from '@/lib/redirect';

// 선택: 이 페이지는 정적 생성하지 않도록 (프리렌더 이슈 회피)
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <Suspense fallback={<div />}>
      <SignInBody />
    </Suspense>
  );
}

function SignInBody() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SigninFormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      console.log('로그인 시도:', { email: data.email });

      const response = await authAPI.signin({
        email: data.email,
        password: data.password,
      });

      console.log('로그인 성공:', response.data);
      alert('로그인이 완료되었습니다!');

      const redirectUrl = redirectAfterLogin();
      router.push(redirectUrl);
    } catch (error) {
      console.error('로그인 중 오류:', error);
      if (error instanceof ApiError) {
        setErrorMessage(error.userMessage);
      } else {
        setErrorMessage('예상치 못한 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-[var(--gray-100)] font-pretendard'>
      <Navbar />
      <main className='flex-1 flex flex-col items-center justify-center pt-16'>
        <ContainerX>
          <section className='w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 mx-auto'>
            <h1 className='text-3xl font-bold text-center text-[var(--text-primary)] mb-8 tracking-tight'>
              로그인
            </h1>

            {errorMessage && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-sm text-red-600 text-center'>❌ {errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
              <div>
                <input
                  {...register('email')}
                  type='email'
                  placeholder='이메일'
                  className='w-full h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                  autoComplete='email'
                  aria-label='이메일'
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>✗ {errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register('password')}
                  type='password'
                  placeholder='비밀번호'
                  className='w-full h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                  autoComplete='current-password'
                  aria-label='비밀번호'
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>✗ {errors.password.message}</p>
                )}
              </div>

              <button
                type='submit'
                disabled={isSubmitting || !isValid}
                className={`w-full py-3 mt-2 font-semibold rounded-lg transition-all ${
                  isSubmitting || !isValid
                    ? 'bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                    : 'bg-[var(--primary)] text-[var(--text-inverse)] hover:bg-[var(--primary-hover)] transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    로그인 중...
                  </span>
                ) : (
                  '로그인'
                )}
              </button>
            </form>

            <p className='mt-4 text-center text-sm text-[var(--text-secondary)]'>
              계정이 없으신가요?{' '}
              <a href='/signup' className='text-[var(--text-accent)] hover:underline'>
                회원가입
              </a>
            </p>

            <div className='my-6 border-t border-[var(--gray-300)]' />

            <button
              type='button'
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className={`flex items-center justify-center w-full border border-[var(--input-border)] rounded-lg py-2 px-4 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                isSubmitting ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white hover:bg-[var(--gray-100)]'
              }`}
              style={{ fontFamily: 'Roboto, Arial, sans-serif', fontWeight: 500 }}
            >
              <img
                src='https://developers.google.com/identity/images/g-logo.png'
                alt='Google Logo'
                className='w-5 h-5 mr-2'
              />
              <span className='text-sm font-medium text-[var(--text-primary)]'>Google로 로그인</span>
            </button>
          </section>
        </ContainerX>
      </main>
    </div>
  );
}
