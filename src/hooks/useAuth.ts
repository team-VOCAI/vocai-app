import { useState, useEffect } from 'react';
import { userAPI } from '@/lib/api';

interface UserInfo {
  nickName?: string;
  email?: string;
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await userAPI.getProfile();
        const data = response.data as { nickName: string; email: string };

        setIsLoggedIn(true);
        setUserInfo({
          nickName: data.nickName,
          email: data.email,
        });
      } catch {
        setIsLoggedIn(false);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return {
    isLoggedIn,
    userInfo,
    isLoading,
  };
}
