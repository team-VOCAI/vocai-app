'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI } from '@/lib/api';
import { authAPI } from '@/lib/api';
import { HiUser, HiPencilSquare } from 'react-icons/hi2';

type Persona = {
  company: string;
  job: string;
  careerLevel: string;
  difficulty: '쉬움' | '중간' | '어려움';
  techStack: string[];
};

interface UserProfile {
  email?: string;
  name?: string;
  nickName?: string;
  phone?: string;
  persona?: Persona;
}

interface GetMeResponse {
  email: string;
  profile?: {
    name?: string;
    nickName?: string;
    phoneNum?: string;
    persona?: Persona;
  };
}

export default function EditProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    nickName: '',
    phone: '',
    persona: {
      company: '',
      job: '',
      careerLevel: '',
      difficulty: '쉬움' as '쉬움' | '중간' | '어려움',
      techStack: [] as string[],
    },
  });
  const [techInput, setTechInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 닉네임 중복 체크 상태
  const [nickChecked, setNickChecked] = useState(false);
  const [nickCheckMsg, setNickCheckMsg] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getMe() as { data: GetMeResponse };
        setProfile({
          email: res.data.email,
          name: res.data.profile?.name ?? '',
          nickName: res.data.profile?.nickName ?? '',
          phone: res.data.profile?.phoneNum ?? '',
          persona: res.data.profile?.persona ?? {
            company: '',
            job: '',
            careerLevel: '',
            difficulty: '쉬움',
            techStack: [],
          },
        });
        setForm({
          name: res.data.profile?.name ?? '',
          nickName: res.data.profile?.nickName ?? '',
          phone: res.data.profile?.phoneNum ?? '',
          persona: {
            company: res.data.profile?.persona?.company ?? '',
            job: res.data.profile?.persona?.job ?? '',
            careerLevel: res.data.profile?.persona?.careerLevel ?? '',
            difficulty: res.data.profile?.persona?.difficulty ?? '쉬움',
            techStack: res.data.profile?.persona?.techStack ?? [],
          },
        });
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('persona.')) {
      const key = name.replace('persona.', '') as keyof Persona;
      setForm(prev => ({
        ...prev,
        persona: {
          ...prev.persona,
          [key]: value,
        },
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));

      // 닉네임 값이 바뀌면 중복 체크 초기화
      if (name === 'nickName') {
        setNickChecked(false);
        setNickCheckMsg('');
      }
    }
  };

  // 기술스택 추가
  const handleTechAdd = () => {
    const tech = techInput.trim();
    if (tech && !form.persona.techStack.includes(tech)) {
      setForm(prev => ({
        ...prev,
        persona: {
          ...prev.persona,
          techStack: [...prev.persona.techStack, tech],
        },
      }));
      setTechInput('');
    }
  };

  // 기술스택 삭제
  const handleTechRemove = (tech: string) => {
    setForm(prev => ({
      ...prev,
      persona: {
        ...prev.persona,
        techStack: prev.persona.techStack.filter(t => t !== tech),
      },
    }));
  };

  // 닉네임 중복 체크
  const handleNickCheck = async () => {
    if (!form.nickName) return;
    try {
      const res = await authAPI.checkNicknameDuplicate(form.nickName) as { data: { available: boolean } };
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
        persona: form.persona,
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
        {/* persona 입력 폼 */}
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">선호기업</label>
          <input
            type="text"
            name="persona.company"
            value={form.persona.company}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            placeholder="예: 네이버"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">선호직종</label>
          <input
            type="text"
            name="persona.job"
            value={form.persona.job}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            placeholder="예: 프론트엔드 개발자"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">커리어레벨</label>
          <input
            type="text"
            name="persona.careerLevel"
            value={form.persona.careerLevel}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
            placeholder="예: 주니어"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="w-24 text-gray-700">면접 난이도</label>
          <select
            name="persona.difficulty"
            value={form.persona.difficulty}
            onChange={handleChange}
            className="flex-1 border rounded px-3 py-2"
          >
            <option value="쉬움">쉬움</option>
            <option value="중간">중간</option>
            <option value="어려움">어려움</option>
          </select>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <label className="w-24 text-gray-700 pt-2">기술스택</label>
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                className="border rounded px-3 py-2 flex-1"
                placeholder="기술스택 입력 후 추가"
              />
              <button
                type="button"
                className="px-3 py-2 bg-gray-200 rounded text-gray-700 font-semibold"
                onClick={handleTechAdd}
                disabled={!techInput.trim()}
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.persona.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {tech}
                  <button
                    type="button"
                    className="ml-1 text-xs text-red-500"
                    onClick={() => handleTechRemove(tech)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end mt-8">
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
