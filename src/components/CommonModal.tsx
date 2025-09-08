'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HiXMark } from 'react-icons/hi2';

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: string;
  message: string;
  cancelText?: string;
  actionText?: string;
  actionLink?: string;
  actionCallback?: () => void;
  variant?: 'info' | 'warning' | 'error' | 'success';
}

export default function CommonModal({
  isOpen,
  onClose,
  icon,
  title,
  message,
  cancelText = '취소',
  actionText,
  actionLink,
  actionCallback,
  variant = 'info',
}: CommonModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleActionClick = () => {
    onClose();

    if (actionCallback) {
      actionCallback();
    } else if (actionLink) {
      router.push(actionLink);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // variant에 따른 색상 설정
  const getVariantColors = () => {
    switch (variant) {
      case 'warning':
        return {
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          actionButton: 'bg-orange-600 hover:bg-orange-700',
        };
      case 'error':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          actionButton: 'bg-red-600 hover:bg-red-700',
        };
      case 'success':
        return {
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          actionButton: 'bg-green-600 hover:bg-green-700',
        };
      default: // info
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          actionButton: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div
      className='fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center'
      onClick={handleOverlayClick}
    >
      <div className='bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative transform transition-all duration-200 scale-100 opacity-100'>
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100'
        >
          <HiXMark className='w-5 h-5' />
        </button>

        {/* 아이콘 */}
        {icon && (
          <div className='flex justify-center mb-4'>
            <div
              className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center`}
            >
              <div className={`${colors.iconColor}`}>{icon}</div>
            </div>
          </div>
        )}

        {/* 제목 */}
        <h3 className='text-xl font-semibold text-gray-900 text-center mb-2'>
          {title}
        </h3>

        {/* 메시지 */}
        <p className='text-gray-600 text-center mb-6 leading-relaxed'>
          {message}
        </p>

        {/* 버튼들 */}
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors'
          >
            {cancelText}
          </button>

          {actionText && (actionLink || actionCallback) && (
            <button
              onClick={handleActionClick}
              className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-colors ${colors.actionButton}`}
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
