'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '@/lib/schemas/auth';
import { authAPI, ApiError, type DuplicateCheckResponse } from '@/lib/api';
import Navbar from '@/components/Navbar';
import ContainerX from '@/components/ContainerX';

export default function SignUpPage() {
  const router = useRouter();
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [emailCheckStatus, setEmailCheckStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({ checked: false, available: false, message: '' });

  const [nicknameCheckStatus, setNicknameCheckStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({ checked: false, available: false, message: '' });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();
  const { email, password, passwordCheck, nickname, phone } = watchedFields;

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid || !email) return;

    try {
      const response = await authAPI.checkEmailDuplicate(email);
      const data = response.data as DuplicateCheckResponse;

      setEmailCheckStatus({
        checked: true,
        available: data.available,
        message: data.message,
      });
    } catch (error) {
      console.error('이메일 중복확인 오류:', error);
      setEmailCheckStatus({
        checked: true,
        available: false,
        message: '중복 확인 중 오류가 발생했습니다.',
      });
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    const isNicknameValid = await trigger('nickname');
    if (!isNicknameValid || !nickname) return;

    try {
      const response = await authAPI.checkNicknameDuplicate(nickname);
      const data = response.data as DuplicateCheckResponse;

      setNicknameCheckStatus({
        checked: true,
        available: data.available,
        message: data.message,
      });
    } catch (error) {
      console.error('닉네임 중복확인 오류:', error);
      setNicknameCheckStatus({
        checked: true,
        available: false,
        message: '중복 확인 중 오류가 발생했습니다.',
      });
    }
  };

  // 휴대폰 인증 버튼 클릭 핸들러
  const handlePhoneVerification = () => {
    setShowVerificationCode(true);
  };

  // 전화번호 포맷팅
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbersOnly = value.replace(/[^\d]/g, '');

    let formattedPhone = '';
    if (numbersOnly.length <= 3) {
      formattedPhone = numbersOnly;
    } else if (numbersOnly.length <= 7) {
      formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else {
      formattedPhone = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
        3,
        7
      )}-${numbersOnly.slice(7, 11)}`;
    }

    setValue('phone', formattedPhone);
  };

  // 비밀번호 강도 계산
  const getPasswordStrength = () => {
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
    const isStrong = strength >= 3;

    return { strength, conditions, isStrong };
  };

  const passwordStrength = getPasswordStrength();

  // 비밀번호 개별 조건 검사
  const passwordValidation = {
    length: password ? password.length >= 8 && password.length <= 64 : false,
    hasUpperCase: password ? /[A-Z]/.test(password) : false,
    hasLowerCase: password ? /[a-z]/.test(password) : false,
    hasNumber: password ? /\d/.test(password) : false,
    hasSpecialChar: password ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : false,
  };

  // 폼 제출 핸들러
  const onSubmit = async (data: SignupFormData) => {
    try {
      // 에러 메시지 초기화
      setSubmitError('');

      // 중복확인 검증
      if (!emailCheckStatus.checked || !emailCheckStatus.available) {
        setSubmitError('이메일 중복확인을 완료해주세요.');
        return;
      }

      if (!nicknameCheckStatus.checked || !nicknameCheckStatus.available) {
        setSubmitError('닉네임 중복확인을 완료해주세요.');
        return;
      }

      // 회원가입 API 호출 (authAPI 사용)
      await authAPI.signup({
        email: data.email,
        password: data.password,
        name: data.name,
        nickname: data.nickname,
        phone: data.phone,
      });

      // 성공 시 로그인 페이지로 리다이렉트
      alert('회원가입이 완료되었습니다.');
      router.push('/signin');
    } catch (error) {
      console.error('회원가입 오류:', error);

      // ApiError 타입 체크 및 에러 메시지 처리
      if (error instanceof ApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  // 이메일이나 닉네임 값이 변경되면 중복확인 상태 초기화
  React.useEffect(() => {
    setEmailCheckStatus((prev) => ({ ...prev, checked: false }));
  }, [email]);

  React.useEffect(() => {
    setNicknameCheckStatus((prev) => ({ ...prev, checked: false }));
  }, [nickname]);

  return (
    <div className='min-h-screen flex flex-col bg-[var(--gray-100)] font-pretendard'>
      <Navbar />
      {/* 회원가입 폼 */}
      <main className='flex-1 flex flex-col items-center justify-center pt-16'>
        <ContainerX>
          <section className='w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 mx-auto my-8'>
            <h1 className='text-3xl font-bold text-center text-[var(--text-primary)] mb-8 tracking-tight'>
              회원가입
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col gap-5'
            >
              {/* 이름 */}
              <div>
                <label
                  htmlFor='name'
                  className='block mb-2 text-sm font-medium text-[var(--text-secondary)]'
                >
                  이름
                </label>
                <input
                  id='name'
                  type='text'
                  placeholder='실명 입력'
                  {...register('name')}
                  className='w-full h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                  autoComplete='name'
                />
                {errors.name && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* 아이디 (이메일) */}
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-[var(--text-secondary)]'
                >
                  아이디
                </label>
                <div className='flex gap-2'>
                  <input
                    id='email'
                    type='email'
                    placeholder='이메일 입력'
                    {...register('email')}
                    className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                    autoComplete='email'
                  />
                  <button
                    type='button'
                    onClick={handleEmailCheck}
                    disabled={!email || !!errors.email}
                    className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      email && !errors.email
                        ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                        : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                    }`}
                  >
                    중복확인
                  </button>
                </div>
                {errors.email && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>
                    {errors.email.message}
                  </p>
                )}
                {emailCheckStatus.checked && (
                  <p
                    className={`text-sm mt-1 ${
                      emailCheckStatus.available
                        ? 'text-[var(--success)]'
                        : 'text-[var(--text-error)]'
                    }`}
                  >
                    {emailCheckStatus.available ? '✓' : '✗'}{' '}
                    {emailCheckStatus.message}
                  </p>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-[var(--text-secondary)]'
                >
                  비밀번호
                </label>
                <input
                  id='password'
                  type='password'
                  placeholder='비밀번호 입력'
                  {...register('password')}
                  maxLength={64}
                  className='w-full h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                  autoComplete='new-password'
                />
                {errors.password && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>
                    {errors.password.message}
                  </p>
                )}

                {/* 비밀번호 강도 인디케이터 */}
                {password && (
                  <div className='mt-3 p-3 bg-[var(--gray-50)] rounded-lg border border-[var(--input-border)]'>
                    <div className='flex items-center justify-between mb-2'>
                      <p className='text-xs font-medium text-[var(--text-secondary)]'>
                        비밀번호 강도:{' '}
                        {passwordStrength.isStrong ? '강함' : '약함'}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          passwordStrength.isStrong
                            ? 'bg-[var(--success)] text-white'
                            : 'bg-[var(--text-error)] text-white'
                        }`}
                      >
                        {passwordStrength.isStrong ? '✓ 통과' : '✗ 부족'}
                      </span>
                    </div>
                    <div className='space-y-2'>
                      {/* 필수 조건 */}
                      <div>
                        <p className='text-xs font-medium text-[var(--text-secondary)] mb-1'>
                          필수 조건:
                        </p>
                        <div
                          className={`flex items-center text-xs ml-2 ${
                            passwordValidation.length
                              ? 'text-[var(--success)]'
                              : 'text-[var(--text-muted)]'
                          }`}
                        >
                          <span className='mr-2'>
                            {passwordValidation.length ? '✓' : '○'}
                          </span>
                          8~64자
                        </div>
                      </div>

                      {/* 선택 조건 */}
                      <div>
                        <p className='text-xs font-medium text-[var(--text-secondary)] mb-1'>
                          선택 조건 (4개 중 2개 이상):
                        </p>
                        <div className='ml-2 space-y-1'>
                          <div
                            className={`flex items-center text-xs ${
                              passwordValidation.hasUpperCase
                                ? 'text-[var(--success)]'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            <span className='mr-2'>
                              {passwordValidation.hasUpperCase ? '✓' : '○'}
                            </span>
                            영문 대문자 포함
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordValidation.hasLowerCase
                                ? 'text-[var(--success)]'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            <span className='mr-2'>
                              {passwordValidation.hasLowerCase ? '✓' : '○'}
                            </span>
                            영문 소문자 포함
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordValidation.hasNumber
                                ? 'text-[var(--success)]'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            <span className='mr-2'>
                              {passwordValidation.hasNumber ? '✓' : '○'}
                            </span>
                            숫자 포함
                          </div>
                          <div
                            className={`flex items-center text-xs ${
                              passwordValidation.hasSpecialChar
                                ? 'text-[var(--success)]'
                                : 'text-[var(--text-muted)]'
                            }`}
                          >
                            <span className='mr-2'>
                              {passwordValidation.hasSpecialChar ? '✓' : '○'}
                            </span>
                            특수문자 포함 (!@#$%^&* 등)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 비밀번호 재확인 */}
              <div>
                <label
                  htmlFor='passwordCheck'
                  className='block mb-2 text-sm font-medium text-[var(--text-secondary)]'
                >
                  비밀번호 재확인
                </label>
                <input
                  id='passwordCheck'
                  type='password'
                  placeholder='비밀번호 재입력'
                  {...register('passwordCheck')}
                  maxLength={64}
                  className='w-full h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                  autoComplete='new-password'
                />
                {errors.passwordCheck && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>
                    {errors.passwordCheck.message}
                  </p>
                )}
                {/* 비밀번호 일치 확인 메시지 - 일치할 때만 표시 */}
                {passwordCheck &&
                  password &&
                  password === passwordCheck &&
                  !errors.passwordCheck && (
                    <p className='text-sm mt-1 text-[var(--success)]'>
                      ✓ 비밀번호가 일치합니다.
                    </p>
                  )}
              </div>

              {/* 닉네임 */}
              <div>
                <label
                  htmlFor='nickname'
                  className='block mb-2 text-sm font-medium text-[var(--text-secondary)]'
                >
                  닉네임
                </label>
                <div className='flex gap-2'>
                  <input
                    id='nickname'
                    type='text'
                    placeholder='닉네임 입력'
                    {...register('nickname')}
                    className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                    autoComplete='nickname'
                  />
                  <button
                    type='button'
                    onClick={handleNicknameCheck}
                    disabled={!nickname || !!errors.nickname}
                    className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      nickname && !errors.nickname
                        ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                        : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                    }`}
                  >
                    중복확인
                  </button>
                </div>
                {errors.nickname && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>
                    {errors.nickname.message}
                  </p>
                )}
                {nicknameCheckStatus.checked && (
                  <p
                    className={`text-sm mt-1 ${
                      nicknameCheckStatus.available
                        ? 'text-[var(--success)]'
                        : 'text-[var(--text-error)]'
                    }`}
                  >
                    {nicknameCheckStatus.available ? '✓' : '✗'}{' '}
                    {nicknameCheckStatus.message}
                  </p>
                )}
              </div>

              {/* 전화번호 */}
              <div>
                <label
                  htmlFor='phone'
                  className='block mb-2 text-sm font-medium text-[var(--text-secondary)]'
                >
                  전화번호
                </label>
                <div className='flex gap-2'>
                  <input
                    id='phone'
                    type='tel'
                    placeholder="'-' 빼고 전화번호 입력"
                    {...register('phone')}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                    autoComplete='tel'
                  />
                  <button
                    type='button'
                    disabled={!phone}
                    onClick={handlePhoneVerification}
                    className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      phone
                        ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                        : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                    }`}
                  >
                    휴대폰 인증
                  </button>
                </div>
                {errors.phone && (
                  <p className='text-sm mt-1 text-[var(--text-error)]'>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* 인증번호 - 휴대폰 인증 버튼 클릭 시에만 표시 */}
              {showVerificationCode && (
                <div>
                  <label
                    htmlFor='code'
                    className='block mb-2 text-sm font-medium text-[var(--text-secondary)]'
                  >
                    인증번호
                  </label>
                  <div className='flex gap-2'>
                    <input
                      id='code'
                      type='text'
                      placeholder='인증번호 입력'
                      {...register('code')}
                      className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                    />
                    <button
                      type='button'
                      disabled={!watchedFields.code}
                      className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                        watchedFields.code
                          ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                          : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                      }`}
                    >
                      인증 확인
                    </button>
                  </div>
                  {errors.code && (
                    <p className='text-sm mt-1 text-[var(--text-error)]'>
                      {errors.code.message}
                    </p>
                  )}
                </div>
              )}

              {/* 에러 메시지 */}
              {submitError && (
                <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
                  <p className='text-sm text-red-600'>{submitError}</p>
                </div>
              )}

              {/* 회원가입 버튼 */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full py-2 mt-2 bg-[var(--primary)] text-[var(--text-inverse)] font-semibold rounded hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? '처리 중...' : '회원가입 하기'}
              </button>
            </form>

            {/* 로그인 링크 */}
            <p className='mt-4 text-center text-sm text-[var(--text-secondary)]'>
              이미 계정이 있으신가요?{' '}
              <a
                href='/signin'
                className='text-[var(--text-accent)] hover:underline'
              >
                로그인
              </a>
            </p>
          </section>
        </ContainerX>
      </main>
    </div>
  );
}
