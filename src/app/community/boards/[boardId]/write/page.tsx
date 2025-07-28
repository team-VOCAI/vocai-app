'use client';

import React, { useState, use } from 'react';
import Navbar from '@/components/Navbar';
import { CommunitySidebar } from '@/features/community/components';
import Link from 'next/link';
import { HiArrowLeft, HiPlus, HiXMark } from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { boardAPI } from '@/lib/api';
import {
  getCategoryInfo,
  boardInfo,
  jobCategories,
  companies,
} from '@/lib/constants/boards';
import {
  formatFileSize,
  getFileIcon,
  normalizeUrl,
  SUPPORTED_FILE_EXTENSIONS,
  MAX_FILE_SIZE,
} from '@/lib/fileUtils';

interface WritePageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default function WritePage({ params }: WritePageProps) {
  const { boardId } = use(params);
  const router = useRouter();
  const board = boardInfo[boardId];
  const categoryInfo = getCategoryInfo(boardId);

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    company: '',
    jobCategory: '',
    tags: [] as string[],
    attachments: [] as Array<{
      name: string;
      size: number;
      type: string;
      data: string;
    }>,
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 기타 옵션 선택 시 사용자 입력 필드
  const [customCompany, setCustomCompany] = useState('');
  const [customJobCategory, setCustomJobCategory] = useState('');

  // Tiptap 에디터 설정
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            'data-placeholder':
              '내용을 입력하세요. 이미지 버튼을 클릭하여 이미지를 추가할 수 있습니다.',
          },
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      TextStyle,
      Color,
      Highlight,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({
        ...prev,
        content: html,
      }));
    },
  });

  // 이미지 추가 함수
  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('이미지 크기는 5MB 이하로 업로드해주세요.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (editor && reader.result) {
            editor
              .chain()
              .focus()
              .setImage({ src: reader.result as string })
              .run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 링크 추가 함수
  // URL 정규화 함수는 /lib/fileUtils.ts로 분리됨

  const addLink = () => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);

    if (selectedText) {
      // 텍스트가 선택된 경우: 선택된 텍스트에 링크 적용
      const url = window.prompt('링크 URL을 입력하세요:');
      if (url) {
        const normalizedUrl = normalizeUrl(url);
        editor.chain().focus().setLink({ href: normalizedUrl }).run();
      }
    } else {
      // 텍스트가 선택되지 않은 경우: URL과 표시할 텍스트 모두 입력받기
      const url = window.prompt('링크 URL을 입력하세요:');
      if (url) {
        const normalizedUrl = normalizeUrl(url);
        const linkText = window.prompt('표시할 텍스트를 입력하세요:', url);
        if (linkText) {
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${normalizedUrl}">${linkText}</a>`)
            .run();
        }
      }
    }
  };

  // 파일 첨부 함수
  const addAttachment = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = SUPPORTED_FILE_EXTENSIONS.join(',');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 파일 크기 제한
        if (file.size > MAX_FILE_SIZE) {
          alert('파일 크기는 10MB 이하로 업로드해주세요.');
          return;
        }

        // 이미 같은 이름의 파일이 있는지 확인
        if (formData.attachments.some((att) => att.name === file.name)) {
          alert('이미 같은 이름의 파일이 첨부되어 있습니다.');
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const newAttachment = {
              name: file.name,
              size: file.size,
              type: file.type,
              data: reader.result as string,
            };

            setFormData((prev) => ({
              ...prev,
              attachments: [...prev.attachments, newAttachment],
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 파일 삭제 함수
  const removeAttachment = (fileName: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.name !== fileName),
    }));
  };

  // 태그 추가
  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }));
      setCurrentTag('');
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    // 기업별 취업 정보 게시판의 경우 기업명과 직무 카테고리 필수
    if (boardId === '1') {
      const finalCompany =
        formData.company === '기타' ? customCompany : formData.company;
      const finalJobCategory =
        formData.jobCategory === '기타'
          ? customJobCategory
          : formData.jobCategory;

      if (!finalCompany || !finalJobCategory) {
        alert('기업명과 직무 카테고리를 입력해주세요.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 메타정보 별도 처리
      const finalCompany =
        formData.company === '기타' ? customCompany : formData.company;
      const finalJobCategory =
        formData.jobCategory === '기타'
          ? customJobCategory
          : jobCategories.find((cat) => cat.value === formData.jobCategory)
              ?.label || formData.jobCategory;

      // 요청 데이터 구성 (boardId는 URL params에서 처리)
      const requestData: {
        title: string;
        content: string;
        attachments: Array<{
          name: string;
          size: number;
          type: string;
          data: string;
        }>;
        company?: string | null;
        jobCategory?: string | null;
        tags?: string[] | null;
      } = {
        title: formData.title,
        content: formData.content, // 순수 내용만
        attachments: formData.attachments,
      };

      // 취업 정보 게시판인 경우 메타정보 추가
      if (['1', '2', '3', '4'].includes(boardId)) {
        requestData.company = finalCompany || null;
        requestData.jobCategory = finalJobCategory || null;
        requestData.tags = formData.tags.length > 0 ? formData.tags : null;
      }

      console.log('🚀 전송할 데이터:', requestData);

      const response = await boardAPI.createPost(boardId, requestData);

      // axios 인스턴스가 이미 에러 처리하므로 여기 도달하면 성공
      alert('게시글이 성공적으로 작성되었습니다.');

      // 테스트용 콘솔 로깅
      console.log(response);

      router.push(`/community/boards/${boardId}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!board) {
    return (
      <>
        <Navbar />
        <main className='min-h-screen pt-16'>
          <div className='flex'>
            <CommunitySidebar selectedBoardId={boardId} />
            <div className='flex-1 bg-[var(--gray-50)]'>
              <div className='p-8'>
                <div className='text-center py-12'>
                  <h1 className='text-2xl font-bold text-[var(--text-primary)] mb-4'>
                    게시판을 찾을 수 없습니다
                  </h1>
                  <Link
                    href='/community'
                    className='text-[var(--text-accent)] hover:underline'
                  >
                    커뮤니티로 돌아가기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className='min-h-screen pt-16'>
        <div className='flex'>
          {/* 좌측 사이드바 */}
          <CommunitySidebar selectedBoardId={boardId} />

          {/* 우측 메인 컨텐츠 */}
          <div className='flex-1 bg-gradient-to-br from-slate-50 to-gray-100'>
            <div className='p-8 max-w-7xl mx-auto'>
              {/* 브레드크럼 */}
              <nav className='mb-8 text-sm text-gray-600'>
                <Link
                  href='/community/boards/1'
                  className='text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200'
                >
                  커뮤니티
                </Link>
                <span className='mx-2 text-gray-400'>/</span>
                {categoryInfo && (
                  <>
                    <Link
                      href={`/community/boards/${categoryInfo.defaultId}`}
                      className='text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200'
                    >
                      {categoryInfo.name}
                    </Link>
                    <span className='mx-2 text-gray-400'>/</span>
                  </>
                )}
                <Link
                  href={`/community/boards/${boardId}`}
                  className='text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200'
                >
                  {board.name}
                </Link>
                <span className='mx-2 text-gray-400'>/</span>
                <span className='text-gray-800 font-medium'>글쓰기</span>
              </nav>

              {/* 페이지 헤더 */}
              <div className='mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h1 className='text-2xl font-bold text-gray-900 mb-2'>
                      {board.name} 글쓰기
                    </h1>
                    <p className='text-gray-600'>{board.description}</p>
                  </div>
                  <Link
                    href={`/community/boards/${boardId}`}
                    className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
                  >
                    <HiArrowLeft className='w-4 h-4' />
                    목록으로
                  </Link>
                </div>
              </div>

              {/* 글쓰기 폼 */}
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* 통합된 글쓰기 폼 */}
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
                  <div className='space-y-6'>
                    {/* 취업 정보 카테고리 전용 필드 (1,2,3,4) */}
                    {['1', '2', '3', '4'].includes(boardId) && (
                      <div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                          {/* 기업명 */}
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              기업명 <span className='text-red-500'>*</span>
                            </label>
                            <select
                              value={formData.company}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  company: e.target.value,
                                }));
                                if (e.target.value !== '기타') {
                                  setCustomCompany('');
                                }
                              }}
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                              required
                            >
                              <option value=''>기업을 선택하세요</option>
                              {companies.map((company) => (
                                <option key={company} value={company}>
                                  {company}
                                </option>
                              ))}
                            </select>
                            {formData.company === '기타' && (
                              <input
                                type='text'
                                value={customCompany}
                                onChange={(e) =>
                                  setCustomCompany(e.target.value)
                                }
                                placeholder='기업명을 직접 입력하세요'
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2'
                                required
                              />
                            )}
                          </div>

                          {/* 직무 카테고리 */}
                          <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                              직무 카테고리{' '}
                              <span className='text-red-500'>*</span>
                            </label>
                            <select
                              value={formData.jobCategory}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  jobCategory: e.target.value,
                                }));
                                if (e.target.value !== '기타') {
                                  setCustomJobCategory('');
                                }
                              }}
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white'
                              required
                            >
                              <option value=''>직무를 선택하세요</option>
                              {jobCategories.map((category) => (
                                <option
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </option>
                              ))}
                            </select>
                            {formData.jobCategory === '기타' && (
                              <input
                                type='text'
                                value={customJobCategory}
                                onChange={(e) =>
                                  setCustomJobCategory(e.target.value)
                                }
                                placeholder='직무를 직접 입력하세요'
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2'
                                required
                              />
                            )}
                          </div>
                        </div>

                        {/* 태그 */}
                        <div className='mb-6'>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            태그 (선택사항)
                          </label>
                          <div className='flex gap-2 mb-3'>
                            <input
                              type='text'
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyPress={(e) =>
                                e.key === 'Enter' &&
                                (e.preventDefault(), addTag())
                              }
                              placeholder='태그를 입력하고 Enter를 누르세요'
                              className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            />
                            <button
                              type='button'
                              onClick={addTag}
                              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200'
                            >
                              <HiPlus className='w-4 h-4' />
                            </button>
                          </div>
                          {formData.tags.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                              {formData.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className='inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
                                >
                                  {tag}
                                  <button
                                    type='button'
                                    onClick={() => removeTag(tag)}
                                    className='text-blue-600 hover:text-blue-800'
                                  >
                                    <HiXMark className='w-3 h-3' />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 구분선 */}
                        <div className='border-t border-gray-200 mb-6'></div>
                      </div>
                    )}

                    {/* 제목 */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        제목 <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder='제목을 입력하세요'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        required
                      />
                    </div>

                    {/* 내용 */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        내용 <span className='text-red-500'>*</span>
                      </label>
                      <div className='border border-gray-300 rounded-lg overflow-hidden'>
                        {/* 툴바 */}
                        <div className='border-b border-gray-200 bg-gray-50 px-3 py-2'>
                          <div className='flex flex-wrap gap-1'>
                            <button
                              type='button'
                              onClick={() =>
                                editor?.chain().focus().toggleBold().run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('bold')
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <strong>B</strong>
                            </button>
                            <button
                              type='button'
                              onClick={() =>
                                editor?.chain().focus().toggleItalic().run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('italic')
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <em>I</em>
                            </button>
                            <button
                              type='button'
                              onClick={() =>
                                editor?.chain().focus().toggleStrike().run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('strike')
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <s>S</s>
                            </button>
                            <div className='w-px h-6 bg-gray-300 mx-1'></div>
                            <button
                              type='button'
                              onClick={() =>
                                editor
                                  ?.chain()
                                  .focus()
                                  .toggleHeading({ level: 1 })
                                  .run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('heading', { level: 1 })
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              H1
                            </button>
                            <button
                              type='button'
                              onClick={() =>
                                editor
                                  ?.chain()
                                  .focus()
                                  .toggleHeading({ level: 2 })
                                  .run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('heading', { level: 2 })
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              H2
                            </button>
                            <button
                              type='button'
                              onClick={() =>
                                editor
                                  ?.chain()
                                  .focus()
                                  .toggleHeading({ level: 3 })
                                  .run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('heading', { level: 3 })
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              H3
                            </button>
                            <div className='w-px h-6 bg-gray-300 mx-1'></div>
                            <button
                              type='button'
                              onClick={() =>
                                editor?.chain().focus().toggleBulletList().run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('bulletList')
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              •
                            </button>
                            <button
                              type='button'
                              onClick={() =>
                                editor
                                  ?.chain()
                                  .focus()
                                  .toggleOrderedList()
                                  .run()
                              }
                              className={`px-2 py-1 rounded text-sm ${
                                editor?.isActive('orderedList')
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              1.
                            </button>
                            <div className='w-px h-6 bg-gray-300 mx-1'></div>
                            <button
                              type='button'
                              onClick={addLink}
                              className='px-2 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100'
                            >
                              🔗
                            </button>
                            <button
                              type='button'
                              onClick={addImage}
                              className='px-2 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100'
                            >
                              🖼️
                            </button>
                          </div>
                        </div>
                        {/* 에디터 */}
                        <div
                          className='min-h-[300px] p-3 cursor-text'
                          onClick={(e) => {
                            // 링크나 버튼 클릭 시에는 에디터 포커스하지 않음
                            const target = e.target as HTMLElement;
                            if (target.tagName === 'A' || target.closest('a')) {
                              return;
                            }
                            editor?.chain().focus().run();
                          }}
                        >
                          <EditorContent
                            editor={editor}
                            className='prose prose-sm max-w-none focus:outline-none h-full'
                          />
                        </div>
                      </div>

                      <div className='mt-2 text-sm text-gray-500'>
                        {boardId === '1' && (
                          <p>
                            💡 팁: 채용 공고 링크, 지원 방법, 면접 질문 유형,
                            필요 기술스택 등을 포함하면 더 유용한 정보가 됩니다.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 첨부 파일 섹션 */}
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        첨부 파일{' '}
                        <span className='text-gray-500'>(선택사항)</span>
                      </label>

                      {/* 파일 업로드 버튼 */}
                      <button
                        type='button'
                        onClick={addAttachment}
                        className='mb-3 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2 text-gray-600 hover:text-blue-600'
                      >
                        <span className='text-lg'>📎</span>
                        <span>파일 선택 (최대 10MB)</span>
                      </button>

                      {/* 첨부 파일 목록 */}
                      {formData.attachments.length > 0 && (
                        <div className='space-y-2'>
                          {formData.attachments.map((file, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'
                            >
                              <div className='flex items-center gap-3'>
                                <span className='text-xl'>
                                  {getFileIcon(file.type)}
                                </span>
                                <div>
                                  <p className='text-sm font-medium text-gray-900'>
                                    {file.name}
                                  </p>
                                  <p className='text-xs text-gray-500'>
                                    {formatFileSize(file.size)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type='button'
                                onClick={() => removeAttachment(file.name)}
                                className='text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors duration-200'
                                title='파일 삭제'
                              >
                                <HiXMark className='w-4 h-4' />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 파일 업로드 안내 */}
                      <div className='mt-2 text-xs text-gray-500'>
                        <p>
                          지원 형식: CSV, DOC, DOCX, HWP, JPG, PDF, PNG, PPT,
                          PPTX, RAR, TXT, XLS, XLSX, ZIP
                        </p>
                      </div>
                    </div>

                    {/* 제출 버튼 */}
                    <div className='pt-4 border-t border-gray-200'>
                      <div className='flex gap-3 justify-end'>
                        <Link
                          href={`/community/boards/${boardId}`}
                          className='px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200'
                        >
                          취소
                        </Link>
                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors duration-200'
                        >
                          {isSubmitting ? '작성 중...' : '글 작성'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
