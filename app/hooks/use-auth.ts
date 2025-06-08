import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getStoredToken, setStoredToken, clearStoredToken, isAuthenticated } from '~/lib/auth';
import { login, register, type User } from '~/lib/auth-api';
import { apiClient } from '~/lib/api-client';

interface AuthUser {
  userId: string;
  displayName: string;
  user: User;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Fetch user profile to verify token is still valid
          const { data: profile } = await apiClient.get<any>('/profile');
          setUser({ 
            userId: profile.user_id,
            displayName: profile.display_name, 
            user: profile
          });
        } catch (error) {
          // Token is invalid, clear it
          clearStoredToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (userId: string, password: string, displayName: string) => {
    try {
      const authResponse = await register({ user_id: userId, password, display_name: displayName });
      setStoredToken(authResponse.token, 86400); // 24 hours
      
      setUser({ 
        userId: authResponse.user.user_id,
        displayName: authResponse.user.display_name,
        user: authResponse.user
      });
      
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (userId: string, password: string) => {
    try {
      const authResponse = await login({ user_id: userId, password });
      setStoredToken(authResponse.token, 86400); // 24 hours
      
      setUser({ 
        userId: authResponse.user.user_id,
        displayName: authResponse.user.display_name,
        user: authResponse.user
      });
      
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    clearStoredToken();
    setUser(null);
    navigate('/login');
  };

  return { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signOut,
    isAuthenticated: isAuthenticated()
  };
}