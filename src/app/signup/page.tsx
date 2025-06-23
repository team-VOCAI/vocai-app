'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ContainerX from '@/components/ContainerX';

export default function SignUpPage() {
  // 각 입력 필드의 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  // 인증번호 입력 부분 표시 여부
  const [showVerificationCode, setShowVerificationCode] = useState(false);

  // 이메일 형식 검증 상태
  const [isEmailValid, setIsEmailValid] = useState(false);

  // 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // 입력 필드 변경 핸들러 함수들
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // 이메일 형식 검증 (기본적인 이메일 정규표현식)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // 실시간 비밀번호 유효성 검사
    setPasswordValidation({
      length: value.length >= 8 && value.length <= 64,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    });
  };

  const handlePasswordCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordCheck(e.target.value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 숫자만 추출
    const numbersOnly = value.replace(/[^\d]/g, '');

    // 전화번호 포맷팅
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

    setPhone(formattedPhone);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  // 비밀번호 강도 확인
  const isPasswordStrong = () => {
    // 필수 조건: 길이 (8~64자)
    if (!passwordValidation.length) return false;

    // 선택 조건: 대문자/소문자/숫자/특수문자 중 2개 이상
    const optionalValidCount = [
      passwordValidation.hasUpperCase,
      passwordValidation.hasLowerCase,
      passwordValidation.hasNumber,
      passwordValidation.hasSpecialChar,
    ].filter(Boolean).length;

    return optionalValidCount >= 2; // 필수 1개 + 선택 2개 = 총 3개 조건
  };

  // 비밀번호 일치 확인
  const isPasswordMatch = () => {
    return password === passwordCheck && passwordCheck.length > 0;
  };

  // 휴대폰 인증 버튼 클릭 핸들러
  const handlePhoneVerification = () => {
    setShowVerificationCode(true);
  };

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
            <form className='flex flex-col gap-5'>
              {/* 아이디 */}
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
                    name='email'
                    type='email'
                    placeholder='이메일 입력'
                    value={email}
                    onChange={handleEmailChange}
                    className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                    autoComplete='email'
                    aria-label='이메일'
                    required
                  />
                  <button
                    type='button'
                    disabled={!email.trim() || !isEmailValid}
                    className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      email.trim() && isEmailValid
                        ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                        : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                    }`}
                  >
                    중복확인
                  </button>
                </div>
                {/* 이메일 형식 확인 메시지 */}
                {email && (
                  <p
                    className={`text-sm mt-1 ${
                      isEmailValid
                        ? 'text-[var(--success)]'
                        : 'text-[var(--text-error)]'
                    }`}
                  >
                    {isEmailValid
                      ? '✓ 올바른 이메일 형식입니다.'
                      : '✗ 이메일 형식으로 작성해주세요. (예: example@domain.com)'}
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
                  name='password'
                  type='password'
                  placeholder='비밀번호 입력'
                  value={password}
                  onChange={handlePasswordChange}
                  maxLength={64}
                  className='w-full h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                  autoComplete='new-password'
                  aria-label='비밀번호'
                  required
                />

                {/* 비밀번호 강도 인디케이터 */}
                {password && (
                  <div className='mt-3 p-3 bg-[var(--gray-50)] rounded-lg border border-[var(--input-border)]'>
                    <div className='flex items-center justify-between mb-2'>
                      <p className='text-xs font-medium text-[var(--text-secondary)]'>
                        비밀번호 강도: {isPasswordStrong() ? '강함' : '약함'}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isPasswordStrong()
                            ? 'bg-[var(--success)] text-white'
                            : 'bg-[var(--text-error)] text-white'
                        }`}
                      >
                        {isPasswordStrong() ? '✓ 통과' : '✗ 부족'}
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
                  name='passwordCheck'
                  type='password'
                  placeholder='비밀번호 재입력'
                  value={passwordCheck}
                  onChange={handlePasswordCheckChange}
                  maxLength={64}
                  className='w-full h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                  autoComplete='new-password'
                  aria-label='비밀번호 재확인'
                  required
                />
                {/* 비밀번호 일치 확인 메시지 */}
                {passwordCheck && (
                  <p
                    className={`text-sm mt-1 ${
                      isPasswordMatch()
                        ? 'text-[var(--success)]'
                        : 'text-[var(--text-error)]'
                    }`}
                  >
                    {isPasswordMatch()
                      ? '✓ 비밀번호가 일치합니다.'
                      : '✗ 비밀번호가 일치하지 않습니다.'}
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
                    name='nickname'
                    type='text'
                    placeholder='닉네임 입력'
                    value={nickname}
                    onChange={handleNicknameChange}
                    className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                    autoComplete='nickname'
                    aria-label='닉네임'
                    required
                  />
                  <button
                    type='button'
                    disabled={!nickname.trim()}
                    className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      nickname.trim()
                        ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                        : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                    }`}
                  >
                    중복확인
                  </button>
                </div>
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
                    name='phone'
                    type='tel'
                    placeholder="'-' 빼고 전화번호 입력"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                    autoComplete='tel'
                    aria-label='전화번호'
                    required
                  />
                  <button
                    type='button'
                    disabled={!phone.trim()}
                    onClick={handlePhoneVerification}
                    className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      phone.trim()
                        ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                        : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                    }`}
                  >
                    휴대폰 인증
                  </button>
                </div>
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
                      name='code'
                      type='text'
                      placeholder='인증번호 입력'
                      value={code}
                      onChange={handleCodeChange}
                      className='flex-1 h-12 px-4 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-ring)] font-medium text-base transition'
                      aria-label='인증번호'
                      required
                    />
                    <button
                      type='button'
                      disabled={!code.trim()}
                      className={`w-24 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                        code.trim()
                          ? 'border border-[var(--primary)] bg-white text-[var(--text-accent)] hover:bg-[var(--primary)] hover:text-[var(--text-inverse)]'
                          : 'border border-[var(--button-disabled-border)] bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] cursor-not-allowed'
                      }`}
                    >
                      인증 확인
                    </button>
                  </div>
                </div>
              )}

              {/* 회원가입 버튼 */}
              <button
                type='submit'
                className='w-full py-2 mt-2 bg-[var(--primary)] text-[var(--text-inverse)] font-semibold rounded hover:bg-[var(--primary-hover)] transition-colors'
              >
                회원가입 하기
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
