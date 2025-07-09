import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VOCAI 커뮤니티',
  description: 'VOCAI 사용자들과 소통하고 정보를 공유하는 커뮤니티 공간입니다.',
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
