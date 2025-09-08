# VocAI 프로젝트

VocAI는 음성 기반 면접 연습과 커뮤니티 기능을 제공하는 Next.js 웹 애플리케이션입니다. Google Gemini와 ElevenLabs API를 활용하여 질문을 생성하고, 음성으로 질문을 출력하며, 사용자의 답변을 텍스트로 전사합니다. 또한 게시판과 댓글을 통해 사용자 간 상호작용이 가능한 커뮤니티를 제공합니다.

## 주요 기능

### 🧠 AI 면접 연습
- Google Gemini(`GEMINI_API_KEY`)를 이용해 지원자의 페르소나와 이전 답변을 분석한 다음 질문을 생성합니다.
- ElevenLabs(`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`)를 통해 질문을 자연스러운 음성으로 읽어 주며,
  `ELEVENLABS_STT_MODEL_ID` 모델을 사용해 사용자의 음성 답변을 텍스트로 전사합니다.
- 면접 세션은 데이터베이스에 저장되며, 전체 요약과 피드백을 생성하여 학습에 도움을 줍니다.

### 📝 커뮤니티
- 게시판/게시글/댓글 CRUD, 조회수 증가, 검색 기능을 제공합니다.
- Tiptap 기반 리치 텍스트 에디터로 글을 작성할 수 있습니다.

### 🔐 인증 및 사용자 관리
- NextAuth로 Google OAuth 및 이메일/비밀번호 기반 로그인을 지원합니다.
- 커스텀 JWT(`JWT_SECRET`)를 활용하여 API 요청을 보호합니다.

## 기술 스택

- **프레임워크**: Next.js 15, React 19, TypeScript
- **스타일링**: Tailwind CSS
- **DB/ORM**: Prisma + PostgreSQL
- **인증**: NextAuth, JSON Web Token
- **에디터**: Tiptap
- **AI/음성**: Google GenAI, ElevenLabs

## 폴더 구조

```
src/
├── app/             # Next.js 라우트 및 페이지
├── components/      # 재사용 가능한 UI 컴포넌트
├── features/        # 도메인별 비즈니스 로직
├── lib/             # 공통 유틸리티, Prisma, AI 연동
└── middleware.ts    # 인증 미들웨어
```

## 설치 및 실행 방법

### 1. 요구 사항
- Node.js 20 LTS 이상
- PostgreSQL 데이터베이스

### 2. 저장소 클론 및 의존성 설치
```bash
git clone <repo_url>
cd vocai-app
npm install
```

### 3. 환경 변수 설정
루트 디렉터리에 `.env` 파일을 생성하여 다음 값을 채웁니다.
```env
DATABASE_URL=postgresql://user:password@localhost:5432/vocai
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=optional_voice_id
ELEVENLABS_STT_MODEL_ID=optional_stt_model
```

### 4. 데이터베이스 마이그레이션 및 시드
```bash
npx prisma migrate dev
npm run db:seed
```

### 5. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 <http://localhost:3000>으로 접속합니다.

### 6. 프로덕션 빌드 및 실행
```bash
npm run build
npm start
```

### 7. 린트 검사
코드 스타일 검사를 위해 다음 명령을 실행합니다.
```bash
npm run lint
```

## 텍스트-음성 변환 설정

`ELEVENLABS_API_KEY`와 `ELEVENLABS_VOICE_ID`가 설정되면 ElevenLabs API를 사용하여 면접 질문을 음성으로 출력합니다. 환경 변수가 없으면 브라우저의 `speechSynthesis` API로 대체되며, 음성 인식(STT) 기능은 비활성화됩니다.

## 라이선스


이 프로젝트와 소스 코드의 저작권은 VocAI 팀이 소유하며, 사전 서면 허가 없이 사용, 복제, 수정, 배포를 금합니다.

