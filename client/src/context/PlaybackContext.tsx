import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

type VideoQuality = "auto" | "2160p" | "1440p" | "1080p" | "720p" | "480p" | "360p" | "240p";
type AudioQuality = "high" | "medium" | "low";
type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

interface WatchProgress {
  videoId: string;
  progress: number;
  currentTime: number;
  duration: number;
  lastWatched: string;
  title: string;
  thumbnail: string;
}

interface PlaybackSettings {
  quality: VideoQuality;
  audioQuality: AudioQuality;
  playbackSpeed: PlaybackSpeed;
  autoplay: boolean;
  autoplayNext: boolean;
  loop: boolean;
  muted: boolean;
  volume: number;
  brightness: number;
  subtitles: boolean;
  theater: boolean;
  miniPlayer: boolean;
  gesturesEnabled: boolean;
  doubleTapSeek: number;
  skipIntro: boolean;
  skipCredits: boolean;
}

interface PlaybackContextType {
  settings: PlaybackSettings;
  updateSettings: (updates: Partial<PlaybackSettings>) => void;
  resetSettings: () => void;
  watchProgress: WatchProgress[];
  saveProgress: (progress: WatchProgress) => void;
  getProgress: (videoId: string) => WatchProgress | null;
  clearProgress: (videoId: string) => void;
  clearAllProgress: () => void;
  continueWatching: WatchProgress[];
  recentlyWatched: WatchProgress[];
}

const DEFAULT_SETTINGS: PlaybackSettings = {
  quality: "auto",
  audioQuality: "high",
  playbackSpeed: 1,
  autoplay: false,
  autoplayNext: true,
  loop: false,
  muted: false,
  volume: 100,
  brightness: 100,
  subtitles: false,
  theater: false,
  miniPlayer: false,
  gesturesEnabled: true,
  doubleTapSeek: 10,
  skipIntro: false,
  skipCredits: false,
};

const SETTINGS_KEY = 'blueberry_playback_settings';
const PROGRESS_KEY = 'blueberry_watch_progress';

const PlaybackContext = createContext<PlaybackContextType | undefined>(undefined);

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PlaybackSettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        } catch {
          return DEFAULT_SETTINGS;
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PROGRESS_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(watchProgress));
  }, [watchProgress]);

  const updateSettings = useCallback((updates: Partial<PlaybackSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const saveProgress = useCallback((progress: WatchProgress) => {
    setWatchProgress(prev => {
      const filtered = prev.filter(p => p.videoId !== progress.videoId);
      return [progress, ...filtered].slice(0, 100);
    });
  }, []);

  const getProgress = useCallback((videoId: string): WatchProgress | null => {
    return watchProgress.find(p => p.videoId === videoId) || null;
  }, [watchProgress]);

  const clearProgress = useCallback((videoId: string) => {
    setWatchProgress(prev => prev.filter(p => p.videoId !== videoId));
  }, []);

  const clearAllProgress = useCallback(() => {
    setWatchProgress([]);
  }, []);

  const continueWatching = watchProgress
    .filter(p => p.progress > 5 && p.progress < 95)
    .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
    .slice(0, 20);

  const recentlyWatched = watchProgress
    .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())
    .slice(0, 30);

  return (
    <PlaybackContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        watchProgress,
        saveProgress,
        getProgress,
        clearProgress,
        clearAllProgress,
        continueWatching,
        recentlyWatched,
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}
