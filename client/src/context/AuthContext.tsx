import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth, getUserProfile, type UserProfile } from '@/lib/firebase';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  preferences?: {
    darkMode: boolean;
    autoplay: boolean;
    quality: string;
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthChange(async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile) {
            setUser({
              id: profile.uid,
              username: profile.username,
              email: profile.email,
              createdAt: profile.createdAt,
              preferences: profile.preferences,
            });
          } else {
            setUser({
              id: fbUser.uid,
              username: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              email: fbUser.email || '',
            });
          }
        } catch (error) {
          console.error('Failed to get user profile:', error);
          setUser({
            id: fbUser.uid,
            username: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
          });
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await firebaseAuth.signIn(email, password);
      if (result.success && result.user) {
        const profile = await getUserProfile(result.user.uid);
        if (profile) {
          setUser({
            id: profile.uid,
            username: profile.username,
            email: profile.email,
            createdAt: profile.createdAt,
            preferences: profile.preferences,
          });
        }
        return { success: true };
      }
      return { success: false, error: result.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const result = await firebaseAuth.signUp(email, password, username);
      if (result.success && result.user) {
        setUser({
          id: result.user.uid,
          username,
          email,
          createdAt: new Date().toISOString(),
          preferences: {
            darkMode: true,
            autoplay: true,
            quality: 'auto',
            notifications: true,
          },
        });
        return { success: true };
      }
      return { success: false, error: result.error || 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const result = await firebaseAuth.signOut();
      if (result.success) {
        setUser(null);
        setFirebaseUser(null);
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const result = await firebaseAuth.resetPassword(email);
      if (result.success) {
        return { success: true };
      }
      return { success: false, error: result.error || 'Failed to send reset email' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Request failed' };
    }
  };

  const resetPassword = async (_token: string, _password: string) => {
    return { 
      success: false, 
      error: 'Password reset is handled via the email link. Please check your inbox and click the link to reset your password.' 
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
