'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '@/lib/api'; // API 호출 함수 임포트

interface UserProfile {
  email: string;
  name: string;
  nickname: string;
  phoneNum: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError('프로필 정보를 불러오는데 실패했습니다.');
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setError(null);
    try {
      await updateUserProfile(profile); // 프로필 업데이트 API 호출
      alert('프로필이 성공적으로 업데이트되었습니다.');
      router.push('/mypage/profile'); // 수정 후 프로필 보기 페이지로 이동
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다.');
      console.error('Failed to update user profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">프로필 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center py-8">프로필 정보가 없습니다.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">프로필 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            readOnly // 이메일은 수정 불가
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">이름:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-2">닉네임:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={profile.nickname}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="phoneNum" className="block text-gray-700 text-sm font-bold mb-2">전화번호:</label>
          <input
            type="text"
            id="phoneNum"
            name="phoneNum"
            value={profile.phoneNum}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/mypage/profile')}
          className="ml-4 mt-4 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          취소
        </button>
      </form>
    </div>
  );
}
