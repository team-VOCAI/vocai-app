'use client';

export default function GoogleDeleteButton() {
  const handleDelete = async () => {
    await fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      credentials: 'include',
    });
  };

  return (
    <button onClick={handleDelete}>
      구글 회원탈퇴
    </button>
  );
} 