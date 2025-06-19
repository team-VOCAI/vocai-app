import Navbar from '@/components/Navbar';
import ContainerX from '@/components/ContainerX';

export default function SignUpPage() {
  return (
    <div className='min-h-screen flex flex-col bg-[#F3F4F6] font-pretendard'>
      <Navbar />
      {/* 회원가입 폼 */}
      <main className='flex-1 flex flex-col items-center justify-center pt-16'>
        <ContainerX>
          <section className='w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 mx-auto my-8'>
            <h1 className='text-3xl font-bold text-center text-[#1F2937] mb-8 tracking-tight'>
              회원가입
            </h1>
            <form className='flex flex-col gap-5'>
              {/* 아이디 */}
              <div>
                <label
                  htmlFor='id'
                  className='block mb-2 text-sm font-medium text-[#374151]'
                >
                  아이디
                </label>
                <div className='flex gap-2'>
                  <input
                    id='id'
                    name='id'
                    type='text'
                    placeholder='아이디 입력'
                    className='flex-1 h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                    autoComplete='username'
                    aria-label='아이디'
                  />
                  <button
                    type='button'
                    className='w-24 py-2 border border-[#2563EB] bg-white text-[#2563EB] rounded-lg font-medium hover:bg-[#2563EB] hover:text-white transition whitespace-nowrap'
                  >
                    중복확인
                  </button>
                </div>
              </div>

              {/* 비밀번호 */}
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-[#374151]'
                >
                  비밀번호
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  placeholder='비밀번호 입력'
                  className='w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                  autoComplete='new-password'
                  aria-label='비밀번호'
                />
              </div>

              {/* 비밀번호 재확인 */}
              <div>
                <label
                  htmlFor='passwordCheck'
                  className='block mb-2 text-sm font-medium text-[#374151]'
                >
                  비밀번호 재확인
                </label>
                <input
                  id='passwordCheck'
                  name='passwordCheck'
                  type='password'
                  placeholder='비밀번호 재입력'
                  className='w-full h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                  autoComplete='new-password'
                  aria-label='비밀번호 재확인'
                />
                {/* 에러 메시지 예시 */}
                <p className='text-[#DC2626] text-sm mt-1'>
                  * 패스워드가 일치하지 않습니다.
                </p>
              </div>

              {/* 닉네임 */}
              <div>
                <label
                  htmlFor='nickname'
                  className='block mb-2 text-sm font-medium text-[#374151]'
                >
                  닉네임
                </label>
                <div className='flex gap-2'>
                  <input
                    id='nickname'
                    name='nickname'
                    type='text'
                    placeholder='닉네임 입력'
                    className='flex-1 h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                    autoComplete='nickname'
                    aria-label='닉네임'
                  />
                  <button
                    type='button'
                    className='w-24 py-2 border border-[#2563EB] bg-white text-[#2563EB] rounded-lg font-medium hover:bg-[#2563EB] hover:text-white transition whitespace-nowrap'
                  >
                    중복확인
                  </button>
                </div>
              </div>

              {/* 전화번호 */}
              <div>
                <label
                  htmlFor='phone'
                  className='block mb-2 text-sm font-medium text-[#374151]'
                >
                  전화번호
                </label>
                <div className='flex gap-2'>
                  <input
                    id='phone'
                    name='phone'
                    type='tel'
                    placeholder='전화번호 입력'
                    className='flex-1 h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                    autoComplete='tel'
                    aria-label='전화번호'
                  />
                  <button
                    type='button'
                    className='w-24 py-2 border border-[#2563EB] bg-white text-[#2563EB] rounded-lg font-medium hover:bg-[#2563EB] hover:text-white transition whitespace-nowrap'
                  >
                    휴대폰 인증
                  </button>
                </div>
              </div>

              {/* 인증번호 */}
              <div>
                <label
                  htmlFor='code'
                  className='block mb-2 text-sm font-medium text-[#374151]'
                >
                  인증번호
                </label>
                <div className='flex gap-2'>
                  <input
                    id='code'
                    name='code'
                    type='text'
                    placeholder='인증번호 입력'
                    className='flex-1 h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                    aria-label='인증번호'
                  />
                  <button
                    type='button'
                    className='w-24 py-2 border border-[#2563EB] bg-white text-[#2563EB] rounded-lg font-medium hover:bg-[#2563EB] hover:text-white transition whitespace-nowrap'
                  >
                    인증 확인
                  </button>
                </div>
              </div>

              {/* 이메일 */}
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-sm font-medium text-[#374151]'
                >
                  이메일
                </label>
                <div className='flex gap-2'>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='이메일 입력'
                    className='flex-1 h-12 px-4 rounded-lg border border-[#D1D5DB] bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium text-base placeholder:text-gray-400 transition'
                    autoComplete='email'
                    aria-label='이메일'
                  />
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <button
                type='submit'
                className='w-full py-2 mt-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors'
              >
                회원가입 하기
              </button>
            </form>

            {/* 로그인 링크 */}
            <p className='mt-4 text-center text-sm text-gray-600'>
              이미 계정이 있으신가요?{' '}
              <a href='/signin' className='text-blue-600 hover:underline'>
                로그인
              </a>
            </p>
          </section>
        </ContainerX>
      </main>
    </div>
  );
}
