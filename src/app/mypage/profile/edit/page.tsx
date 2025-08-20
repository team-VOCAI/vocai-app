'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/lib/api';
import { authAPI } from '@/lib/api';
import { HiUser, HiPencilSquare } from 'react-icons/hi2';

interface UserProfile {
  email?: string;
  name?: string;
  nickName?: string;
  phone?: string;
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    nickName: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 닉네임 중복 체크 상태
  const [nickChecked, setNickChecked] = useState(false);
  const [nickCheckMsg, setNickCheckMsg] = useState('');

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
        setForm({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // 닉네임 값이 바뀌면 중복 체크 초기화
    if (name === 'nickName') {
      setNickChecked(false);
      setNickCheckMsg('');
    }
  };

  // 닉네임 중복 체크
  const handleNickCheck = async () => {
    if (!form.nickName) return;
    try {
      const res = await authAPI.checkNicknameDuplicate(form.nickName);
      if (res.data.available) {
        setNickChecked(true);
        setNickCheckMsg('사용 가능한 닉네임입니다.');
      } else {
        setNickChecked(false);
        setNickCheckMsg('이미 사용 중인 닉네임입니다.');
      }
    } catch {
      setNickChecked(false);
      setNickCheckMsg('닉네임 중복 체크 실패');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 닉네임이 기존과 다를 때만 중복 체크 필요
    if (form.nickName !== profile?.nickName && !nickChecked) {
      setError('닉네임 중복 확인을 해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await userAPI.updateMe({
        name: form.name,
        nickName: form.nickName,
        phone: form.phone,
      });
      alert('프로필이 성공적으로 수정되었습니다.');
      router.push('/mypage/profile');
    } catch {
      setError('프로필 수정에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

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
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">이름</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">닉네임</label>
          <input
            type="text"
            name="nickName"
            value={form.nickName}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <button
            type="button"
            className="px-3 py-2 bg-gray-200 rounded text-gray-700 font-semibold"
            onClick={handleNickCheck}
            disabled={!form.nickName}
          >
            중복확인
          </button>
        </div>
        {nickCheckMsg && (
          <div className={`ml-24 mb-2 text-sm ${nickChecked ? 'text-green-600' : 'text-red-500'}`}>
            {nickCheckMsg}
          </div>
        )}
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">전화번호</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">이메일</label>
          <span className="text-gray-800">{profile?.email || '-'}</span>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="absolute right-0 bottom-0">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition"
            disabled={isSaving}
          >
            <HiPencilSquare className="w-5 h-5" />
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
