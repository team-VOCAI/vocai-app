'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/lib/api';
import { HiUser, HiPencilSquare } from 'react-icons/hi2';

interface UserProfile {
  email?: string;
  name?: string;
  nickName?: string;
  phone?: string;
}

export default function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getMe();
        setProfile({
          email: res.data.email,
          name: res.data.profile?.name ?? '',
          nickName: res.data.profile?.nickName ?? '',
          phone: res.data.profile?.phoneNum ?? '',
        });
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-center py-8">프로필 정보를 불러오는 중...</div>;
  }

  return (
    <div className="w-full relative min-h-[400px] pl-2">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-inner">
          <HiUser className="w-9 h-9 text-blue-500" />
        </div>
        <div>
          <div className="text-lg font-bold text-gray-800">{profile?.nickName || '닉네임 없음'}</div>
          <div className="text-sm text-gray-400">{profile?.email || '-'}</div>
        </div>
      </div>
      <table className="w-full border-separate border-spacing-y-2 mb-16">
        <tbody>
          <tr>
            <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">이름</th>
            <td className="py-2 pl-4 text-gray-800">{profile?.name || '-'}</td>
          </tr>
          <tr>
            <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">닉네임</th>
            <td className="py-2 pl-4 text-gray-800">{profile?.nickName || '-'}</td>
          </tr>
          <tr>
            <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">이메일</th>
            <td className="py-2 pl-4 text-gray-800">{profile?.email || '-'}</td>
          </tr>
          <tr>
            <th className="text-left text-gray-500 font-medium w-32 py-2 pl-2">전화번호</th>
            <td className="py-2 pl-4 text-gray-800">{profile?.phone || '-'}</td>
          </tr>
        </tbody>
      </table>
      <div className="absolute right-0 bottom-0">
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
          onClick={() => router.push('/mypage/profile/edit')}
        >
          <HiPencilSquare className="w-5 h-5" />
          정보수정
        </button>
      </div>
    </div>
  );
}
