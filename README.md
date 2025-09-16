# VocAI – AI 면접 연습과 커뮤니티를 잇는 학습 플랫폼

> VocAI는 지원자의 페르소나와 면접 기록을 분석해 맞춤형 질문과 피드백을 제공하고, 커뮤니티에서 실전 정보를 교류할 수 있도록 돕는 Next.js 기반 웹 애플리케이션입니다.

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
  - [AI 모의 면접](#ai-모의-면접)
  - [면접 페르소나 & 마이페이지](#면접-페르소나--마이페이지)
  - [커뮤니티 게시판](#커뮤니티-게시판)
  - [문서화된 REST API](#문서화된-rest-api)
- [시스템 아키텍처](#시스템-아키텍처)
- [사용 기술](#사용-기술)
- [프로젝트 구조](#프로젝트-구조)
- [빠른 시작](#빠른-시작)
  - [1. 사전 요구 사항](#1-사전-요구-사항)
  - [2. 의존성 설치](#2-의존성-설치)
  - [3. 환경 변수 설정](#3-환경-변수-설정)
  - [4. 데이터베이스 마이그레이션 & 시드](#4-데이터베이스-마이그레이션--시드)
  - [5. 개발 서버 실행](#5-개발-서버-실행)
  - [6. 자주 사용하는 스크립트](#6-자주-사용하는-스크립트)
- [데이터베이스 모델 개요](#데이터베이스-모델-개요)
- [AI 면접 플로우](#ai-면접-플로우)
- [커뮤니티 & 마이페이지 기능 세부 사항](#커뮤니티--마이페이지-기능-세부-사항)
- [API 문서 & 테스트](#api-문서--테스트)
- [품질 관리](#품질-관리)
- [Docker 로컬 실행](#docker-로컬-실행)
- [배포 시 고려 사항](#배포-시-고려-사항)
- [라이선스](#라이선스)

## 프로젝트 개요
VocAI는 구글 Gemini와 ElevenLabs 음성 서비스를 활용해 실전과 유사한 면접 환경을 구축하고, 면접 준비에 필요한 정보를 커뮤니티에서 함께 만들어 가는 서비스입니다. 사용자는 자신의 페르소나(지원 분야·난이도·경력 등)를 설정한 뒤 음성으로 질문을 듣고 답변하며, AI가 요약과 피드백을 제공하는 반복 학습 경험을 누릴 수 있습니다. 커뮤니티 게시판과 댓글을 통해 회사/직무별 정보를 공유하고 면접 준비 노하우를 교환할 수 있습니다.

## 주요 기능
### AI 모의 면접
- **질문 생성**: Google Gemini(`gemini-2.5-flash`)가 지원자의 페르소나와 직전 답변을 분석해 다음 질문을 한국어로 한 문장 생성합니다.
- **답변 분석**: 각 답변에 대해 Gemini가 요약과 개선 피드백을 구조화된 형식으로 반환합니다.
- **세션 요약**: 면접이 종료되면 전 질문/답변을 기반으로 세션 요약과 종합 피드백을 별도로 생성해 학습 방향을 제시합니다.
- **음성 입출력**: ElevenLabs TTS/STT API로 질문을 음성으로 재생하고, 사용자의 음성을 텍스트로 전사합니다. 키가 없을 경우 브라우저 `speechSynthesis` API로 자동 폴백합니다.
- **세션 관리**: 면접 세션은 Prisma를 통해 PostgreSQL에 저장되며, 제목 변경·삭제·다시보기 기능을 제공합니다.

### 면접 페르소나 & 마이페이지
- **페르소나 편집**: 지원 회사, 직무, 경력 레벨, 희망 난이도, 기술 스택 등을 JSON 형식으로 저장하고 면접 질문 생성에 활용합니다.
- **프로필 관리**: 이름·닉네임·연락처 등 프로필 정보를 수정하고, 본인이 작성한 게시글을 한눈에 확인할 수 있습니다.
- **JWT 기반 인증**: 이메일/비밀번호 로그인 시 커스텀 JWT를 발급해 보호된 API에 접근하며, NextAuth를 통해 Google OAuth 로그인도 지원합니다.

### 커뮤니티 게시판
- **게시판/게시글/댓글 CRUD**: 회사·직무·태그 정보를 포함한 게시글 작성, 수정, 삭제 및 조회수를 제공합니다.
- **첨부파일 업로드**: Tiptap 리치 텍스트 에디터와 파일 업로드를 지원하며, 첨부파일은 Prisma 모델을 통해 안전하게 저장/다운로드 됩니다.
- **검색 & 통계**: 게시판별 게시글 수 통계, 검색 API, 마이페이지 내 내 글 관리 등 커뮤니티 활동을 돕는 도구를 제공합니다.

### 문서화된 REST API
- `/api` 경로에 Next.js Route Handler로 구성된 REST API를 제공하며, JWT 기반 인증이 필요한 엔드포인트는 쿠키에 저장된 토큰을 검사합니다.
- `/api/swagger`에서 OpenAPI 3.1 명세(JSON)를 제공하고, `/api-docs` 페이지에서 Swagger UI로 상호작용형 문서를 확인할 수 있습니다.

## 시스템 아키텍처
- **프론트엔드**: Next.js 15(App Router) + React 19. Turbopack 기반 개발 서버를 통해 빠른 HMR을 제공합니다.
- **백엔드**: Next.js Route Handler가 API 서버 역할을 수행하며 Prisma Client를 통해 PostgreSQL과 통신합니다.
- **AI 연동**: `src/lib/gemini.ts`에서 GoogleGenAI SDK를 초기화해 질문/피드백/세션 요약을 생성합니다.
- **음성 서비스**: Edge Runtime에서 동작하는 STT 엔드포인트와 Node Runtime에서 동작하는 TTS 엔드포인트로 ElevenLabs API와 통신합니다.
- **인증**: NextAuth(구글 OAuth) + 커스텀 JWT(이메일 로그인) 조합으로 다양한 인증 시나리오를 지원합니다.
- **문서화**: Swagger 명세를 정적 JSON으로 제공하고, 클라이언트에서 CDN 기반 Swagger UI를 로드합니다.

## 사용 기술
| 영역 | 기술 |
| --- | --- |
| 프레임워크 | Next.js 15, React 19, TypeScript |
| 스타일링 | Tailwind CSS v4, 커스텀 Design Token(Pretendard) |
| 인증 | NextAuth(구글 OAuth), JSON Web Token, bcrypt |
| 데이터 | Prisma ORM, PostgreSQL |
| 에디터 | Tiptap, Embla Carousel(홈 화면) |
| AI/음성 | Google Gemini(Google GenAI SDK), ElevenLabs TTS/STT |
| 품질 | ESLint 9, TypeScript strict 모드 |
| 배포 | Dockerfile(멀티 스테이지), docker-compose |

## 프로젝트 구조
```
├── src/
│   ├── app/                # App Router, 페이지 및 API 라우트
│   │   ├── api/            # REST API(Route Handler)
│   │   ├── interview/ai    # AI 면접 클라이언트 화면
│   │   ├── community/      # 게시판 목록·상세·글쓰기 페이지
│   │   ├── mypage/         # 프로필 및 내가 쓴 글 관리
│   │   ├── signin | signup # 인증 관련 페이지
│   │   └── api-docs        # Swagger UI 페이지
│   ├── components/         # 공용 UI 컴포넌트(Navbar, Recorder 등)
│   ├── features/           # 도메인별 컴포넌트 집합(home, community)
│   ├── hooks/              # 커스텀 훅
│   ├── lib/                # Prisma, JWT, Gemini, Swagger 스키마 등 공용 로직
│   └── middleware.ts       # 인증 관련 미들웨어(NextAuth)
├── prisma/
│   ├── schema.prisma       # 데이터 모델 정의
│   ├── migrations/         # Prisma 마이그레이션 기록
│   └── seed.ts             # 기본 게시판 시드 스크립트
├── public/                 # 정적 자산(배너 이미지 등)
├── docker-compose.yml      # 로컬 컨테이너 실행 정의
├── Dockerfile              # 프로덕션 빌드용 멀티 스테이지 이미지
└── package.json            # 스크립트 및 의존성 정의
```

## 빠른 시작
### 1. 사전 요구 사항
- Node.js **20 LTS** 이상
- npm 10 이상 (Node 20에 포함)
- PostgreSQL 데이터베이스 또는 Docker Desktop (로컬 컨테이너 사용 시)
- Google Gemini API Key, ElevenLabs API Key(선택) 및 Google OAuth 클라이언트 설정

### 2. 의존성 설치
```bash
git clone <repo_url>
cd vocai-app
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 채워주세요.

| 이름 | 필수 | 설명 |
| --- | :---: | --- |
| `DATABASE_URL` | ✅ | `postgresql://user:password@host:5432/vocai?schema=public` 형식의 연결 문자열 |
| `NEXTAUTH_SECRET` | ✅ | NextAuth 세션 암호화 키 |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth 애플리케이션 자격 증명 |
| `JWT_SECRET` | ✅ | 이메일 로그인 시 발급하는 JWT 서명 키 |
| `GEMINI_API_KEY` | ✅ | Google GenAI SDK에서 사용하는 Gemini API 키 |
| `ELEVENLABS_API_KEY` | ⛔️* | 음성 합성/인식을 위해 필요 (없으면 브라우저 `speechSynthesis`로 폴백) |
| `ELEVENLABS_VOICE_ID` | 옵션 | 사용할 ElevenLabs 음성 ID (미지정 시 기본 음성) |
| `ELEVENLABS_STT_MODEL_ID` | 옵션 | STT에 사용할 모델 ID (`eleven_monolingual_v1` 기본값) |

> ⛔️* 음성 기능 없이 텍스트 기반 면접만 사용하려면 비워둘 수 있습니다.

Docker Compose를 사용할 경우 다음 변수도 `.env`에 추가하세요.
```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vocai
```

### 4. 데이터베이스 마이그레이션 & 시드
```bash
npx prisma migrate dev
npm run db:seed
```
`db:seed` 스크립트는 기본 게시판(채용공고, 면접후기 등 6개)을 생성합니다.

### 5. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 <http://localhost:3000>으로 접속합니다. Turbopack이 활성화되어 빠른 HMR을 제공합니다.

### 6. 자주 사용하는 스크립트
| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Turbopack 기반 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 생성 (`.next` 출력) |
| `npm start` | 빌드 결과 실행(Production 모드) |
| `npm run lint` | ESLint 검사 실행 |
| `npm run db:seed` | Prisma 시드 데이터 삽입 |

## 데이터베이스 모델 개요
- **User**: 인증 정보(로그인 ID, 비밀번호, 이메일 등)를 저장하며 NextAuth Account/Sessions와 연동됩니다.
- **Profile**: 사용자 공개 프로필(닉네임, 연락처, 페르소나) 및 게시글/댓글 관계를 관리합니다.
- **Board / Post / Comment**: 게시판, 게시글, 댓글 구조를 구성하며 Soft Delete(`deletedAt`)를 지원합니다.
- **Attachment**: 게시글 첨부파일 이진 데이터를 저장하고, 다운로드 API에서 `Content-Disposition` 헤더로 파일명을 보존합니다.
- **MockInterviewSession / MockInterviewRecord**: 면접 세션과 개별 질문/답변/피드백 기록을 저장해 재방문 및 세션 요약 기능을 제공합니다.

## AI 면접 플로우
1. **페르소나 설정**: 마이페이지에서 면접 페르소나를 저장해야 새 세션을 시작할 수 있습니다.
2. **세션 시작**: `/api/AIInterview/start` 호출로 세션을 만들고 첫 질문을 생성합니다.
3. **질문 음성 출력**: `/api/tts`가 ElevenLabs로 음성을 합성하고, 실패 시 `speechSynthesis`가 대체합니다.
4. **답변 녹음 & 전사**: `Recorder` 컴포넌트가 MediaRecorder로 음성을 녹음하고 `/api/AIInterview/[sessionId]/record`에서 STT로 텍스트를 얻습니다.
5. **답변 저장 & 피드백**: `/api/AIInterview/[sessionId]/answer`가 답변을 저장하고 Gemini로 요약/피드백을 생성합니다.
6. **다음 질문 생성**: `/api/AIInterview/[sessionId]/question`이 이전 기록을 참고해 후속 질문을 생성합니다.
7. **세션 종료**: `/api/AIInterview/end`가 전체 기록을 기반으로 세션 요약과 종합 피드백을 저장합니다.
8. **세션 기록 관리**: 세션 리스트에서 제목 수정/삭제/재생성 등을 수행할 수 있습니다.

## 커뮤니티 & 마이페이지 기능 세부 사항
- **게시글 작성/수정**: Tiptap 에디터를 활용하고, Base64로 전달된 첨부파일을 Prisma `Attachment` 테이블에 저장합니다.
- **게시판 통계**: `/api/boards/stats`가 게시판별 게시글 수를 제공하여 홈 화면 하이라이트 또는 대시보드에 활용할 수 있습니다.
- **댓글 관리**: `/api/comments` 및 `/api/comments/[commentId]`에서 댓글 CRUD와 Soft Delete를 지원합니다.
- **내 활동 조회**: `/api/user/posts`가 JWT로 인증된 사용자의 게시글 목록을 반환합니다.
- **프로필 보호**: `getProfileFromRequest` 유틸리티가 JWT 토큰을 검증해 민감 정보 접근을 제한합니다.

## API 문서 & 테스트
- 개발 서버 실행 후 <http://localhost:3000/api-docs>에서 Swagger UI로 전체 API를 탐색할 수 있습니다.
- JSON 명세는 <http://localhost:3000/api/swagger>에서 제공되며, Postman/Insomnia에 그대로 Import할 수 있습니다.
- 보호된 엔드포인트는 `/api/auth/signin`에서 발급되는 `token` 쿠키 또는 NextAuth 세션이 필요합니다.

## 품질 관리
- `npm run lint`로 ESLint 9 규칙을 실행하여 코드 일관성을 유지합니다.
- TypeScript 설정을 통해 런타임 이전에 타입 오류를 방지합니다.
- Prisma Client는 개발 환경에서 싱글톤으로 재사용해 커넥션 누수를 방지합니다.

## Docker 로컬 실행
Docker와 Docker Compose가 설치되어 있다면 다음 명령으로 앱과 PostgreSQL을 동시에 실행할 수 있습니다.
```bash
docker-compose up -d
```
- `db` 서비스가 PostgreSQL 16-alpine 이미지를 실행하고, `pgdata` 볼륨에 데이터를 저장합니다.
- `migrate` 서비스가 Prisma 마이그레이션 및 시드 작업을 수행한 뒤 종료됩니다.
- `web` 서비스가 빌더 스테이지에서 컴파일한 Next.js 앱을 Production 모드로 실행합니다.
- `.env` 파일에 정의된 `GEMINI_API_KEY`가 Docker 빌드 시에도 전달되어야 하므로 빈 값으로 두지 마세요.

로그 확인 및 종료는 다음 명령을 사용합니다.
```bash
docker-compose logs -f web
docker-compose down
```

## 배포 시 고려 사항
- `npm run build` → `npm start` 프로세스를 사용하며, `DATABASE_URL`, `GEMINI_API_KEY`, `NEXTAUTH_SECRET`, `JWT_SECRET` 등 필수 환경 변수는 런타임에도 주입해야 합니다.
- ElevenLabs 키가 없는 환경에서는 음성 기능이 제한되므로 사용자 안내 문구를 노출하는 것을 권장합니다.
- Prisma 마이그레이션은 프로덕션 환경에서 `npx prisma migrate deploy`로 실행하세요.
- Docker 이미지를 활용하는 경우 `GEMINI_API_KEY`를 빌드 시크릿 또는 CI/CD 환경 변수로 전달해야 합니다.

## 라이선스
이 프로젝트와 소스 코드는 VocAI 팀이 소유합니다. 사전 서면 허가 없이 사용, 복제, 수정, 배포를 금합니다.
