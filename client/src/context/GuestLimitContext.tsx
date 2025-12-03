import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

const TOTAL_VIDEOS_AVAILABLE = 126000;
const STORAGE_KEY = 'blueberry_guest_videos_watched';

interface GuestLimitContextType {
  videosWatched: number;
  videosRemaining: number;
  hasReachedLimit: boolean;
  recordVideoWatch: (videoId: string) => void;
  isGuest: boolean;
  totalVideosAvailable: number;
}

const GuestLimitContext = createContext<GuestLimitContextType | undefined>(undefined);

export function GuestLimitProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return new Set(JSON.parse(stored));
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...watchedVideos]));
  }, [watchedVideos]);

  const recordVideoWatch = (videoId: string) => {
    if (!watchedVideos.has(videoId)) {
      setWatchedVideos(prev => new Set([...prev, videoId]));
    }
  };

  const videosWatched = watchedVideos.size;
  const videosRemaining = TOTAL_VIDEOS_AVAILABLE - videosWatched;
  const hasReachedLimit = false;

  return (
    <GuestLimitContext.Provider
      value={{
        videosWatched,
        videosRemaining,
        hasReachedLimit,
        recordVideoWatch,
        isGuest: !isAuthenticated,
        totalVideosAvailable: TOTAL_VIDEOS_AVAILABLE,
      }}
    >
      {children}
    </GuestLimitContext.Provider>
  );
}

export function useGuestLimit() {
  const context = useContext(GuestLimitContext);
  if (!context) {
    throw new Error('useGuestLimit must be used within a GuestLimitProvider');
  }
  return context;
}
