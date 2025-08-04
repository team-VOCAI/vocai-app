import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import type { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma), // Prisma와 연동
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 구글 로그인 시 User/Profile 자동 생성 및 이메일 중복 계정 자동 연결
    async signIn({ user, account, profile }: any) {
      console.log('account', account);
      console.log('profile', profile);
      console.log('user', user);
      if (account?.provider === "google") {
        const googleId = profile?.sub || user.id;
        if (!googleId) return false;
        // 1. 이메일로 기존 유저 찾기
        if (typeof user.email !== 'string') {
          return false;
        }
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (existingUser) {
          // 2. 이미 계정이 있으면, 해당 userId로 account 연결
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {
              userId: existingUser.userId,
            },
            create: {
              userId: existingUser.userId,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: typeof account.access_token === 'string' ? account.access_token : undefined,
              id_token: typeof account.id_token === 'string' ? account.id_token : undefined,
              expires_at: account.expires_at,
              token_type: typeof account.token_type === 'string' ? account.token_type : undefined,
              scope: typeof account.scope === 'string' ? account.scope : undefined,
              refresh_token: typeof account.refresh_token === 'string' ? account.refresh_token : undefined,
              session_state: typeof account.session_state === 'string' ? account.session_state : undefined,
            },
          });
          return true;
        } else {
          // 기존 유저가 없으면 신규 생성
          const newUser = await prisma.user.create({
            data: {
              loginId: googleId,
              password: '',
              email: typeof user.email === 'string' ? user.email : '',
              name: typeof user.name === 'string' ? user.name : '',
              image: typeof user.image === 'string' ? user.image : '',
              emailVerified: undefined,
            }
          });
          await prisma.profile.create({
            data: {
              userId: newUser.userId,
              nickName: user.name || `user_${googleId.slice(-6)}`,
              name: user.name || '',
              phoneNum: '',
              email: user.email || '',
            }
          });
        }
      }
      return true;
    },
    
        // JWT 토큰에 사용자 id 추가
    async jwt({ token, user }: any) {
      console.log('1 JWT 콜백의 user:', user);
      if (user) {
        console.log('👤 JWT 콜백의 user:', user);
        token.id = user.id ?? user.userId ?? null;
        token.email = user.email ?? null;
        console.log('token.id', token.id);
        console.log('token.email', token.email);
      }
      return token;
    },
    // 세션에 사용자 id 추가
    async session({ session, token }: any) {
      if (!session.user) {
        session.user = {};
        console.log('세션', session.user);
      }
        session.user.id = token.id ?? null;
        console.log('토큰id', token.id);
        session.user.email = token.email ?? null;
        console.log('토큰email', token.email);
      console.log('📦 최종 session:', session);
      return session;
    },

  },
  // 커스텀 로그인 페이지 경로
  pages: {
    signIn: '/signin',
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);