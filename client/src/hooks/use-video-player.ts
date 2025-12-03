import { useState, useCallback, useRef, useEffect } from 'react';

export interface VideoPlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  progress: number;
  playbackRate: number;
  isFullscreen: boolean;
  isTheaterMode: boolean;
  isPiP: boolean;
  brightness: number;
  contrast: number;
  isLooping: boolean;
  quality: string;
  isLoading: boolean;
  hasError: boolean;
  buffered: number;
}

export interface VideoPlayerActions {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleFullscreen: () => void;
  toggleTheaterMode: () => void;
  togglePiP: () => void;
  setBrightness: (brightness: number) => void;
  setContrast: (contrast: number) => void;
  toggleLoop: () => void;
  setQuality: (quality: string) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
}

const DEFAULT_SKIP_SECONDS = 10;

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const QUALITY_OPTIONS = ['auto', '1080p', '720p', '480p', '360p', '240p'];

export function useVideoPlayer(containerRef: React.RefObject<HTMLElement>) {
  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    progress: 0,
    playbackRate: 1,
    isFullscreen: false,
    isTheaterMode: false,
    isPiP: false,
    brightness: 100,
    contrast: 100,
    isLooping: false,
    quality: 'auto',
    isLoading: true,
    hasError: false,
    buffered: 0,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const play = useCallback(() => {
    videoRef.current?.play();
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    }
  }, [state.duration]);

  const seekRelative = useCallback((delta: number) => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime + delta;
      videoRef.current.currentTime = Math.max(0, Math.min(newTime, state.duration));
    }
  }, [state.duration]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (videoRef.current) {
      videoRef.current.volume = clampedVolume;
    }
    setState(prev => ({ 
      ...prev, 
      volume: clampedVolume,
      isMuted: clampedVolume === 0 
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !state.isMuted;
    }
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, [state.isMuted]);

  const setPlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setState(prev => ({ ...prev, playbackRate: rate }));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
        setState(prev => ({ ...prev, isFullscreen: true }));
      } else {
        await document.exitFullscreen();
        setState(prev => ({ ...prev, isFullscreen: false }));
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [containerRef]);

  const toggleTheaterMode = useCallback(() => {
    setState(prev => ({ ...prev, isTheaterMode: !prev.isTheaterMode }));
  }, []);

  const togglePiP = useCallback(async () => {
    try {
      if (!document.pictureInPictureElement && videoRef.current) {
        await videoRef.current.requestPictureInPicture();
        setState(prev => ({ ...prev, isPiP: true }));
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setState(prev => ({ ...prev, isPiP: false }));
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  }, []);

  const setBrightness = useCallback((brightness: number) => {
    const clampedBrightness = Math.max(10, Math.min(200, brightness));
    setState(prev => ({ ...prev, brightness: clampedBrightness }));
  }, []);

  const setContrast = useCallback((contrast: number) => {
    const clampedContrast = Math.max(50, Math.min(200, contrast));
    setState(prev => ({ ...prev, contrast: clampedContrast }));
  }, []);

  const toggleLoop = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.loop = !state.isLooping;
    }
    setState(prev => ({ ...prev, isLooping: !prev.isLooping }));
  }, [state.isLooping]);

  const setQuality = useCallback((quality: string) => {
    setState(prev => ({ ...prev, quality }));
  }, []);

  const skipForward = useCallback((seconds = DEFAULT_SKIP_SECONDS) => {
    seekRelative(seconds);
  }, [seekRelative]);

  const skipBackward = useCallback((seconds = DEFAULT_SKIP_SECONDS) => {
    seekRelative(-seconds);
  }, [seekRelative]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setState(prev => ({ ...prev, isFullscreen: !!document.fullscreenElement }));
    };

    const handlePiPChange = () => {
      setState(prev => ({ ...prev, isPiP: !!document.pictureInPictureElement }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('enterpictureinpicture', handlePiPChange);
    document.addEventListener('leavepictureinpicture', handlePiPChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('enterpictureinpicture', handlePiPChange);
      document.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, []);

  const actions: VideoPlayerActions = {
    play,
    pause,
    togglePlay,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    toggleTheaterMode,
    togglePiP,
    setBrightness,
    setContrast,
    toggleLoop,
    setQuality,
    skipForward,
    skipBackward,
  };

  return {
    state,
    actions,
    videoRef,
    playbackRates: PLAYBACK_RATES,
    qualityOptions: QUALITY_OPTIONS,
  };
}

export function useKeyboardShortcuts(
  actions: VideoPlayerActions,
  state: VideoPlayerState,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          actions.togglePlay();
          break;
        case 'f':
          e.preventDefault();
          actions.toggleFullscreen();
          break;
        case 't':
          e.preventDefault();
          actions.toggleTheaterMode();
          break;
        case 'p':
          e.preventDefault();
          actions.togglePiP();
          break;
        case 'm':
          e.preventDefault();
          actions.toggleMute();
          break;
        case 'l':
          e.preventDefault();
          actions.toggleLoop();
          break;
        case 'arrowleft':
          e.preventDefault();
          if (e.shiftKey) {
            actions.skipBackward(30);
          } else {
            actions.skipBackward(10);
          }
          break;
        case 'arrowright':
          e.preventDefault();
          if (e.shiftKey) {
            actions.skipForward(30);
          } else {
            actions.skipForward(10);
          }
          break;
        case 'arrowup':
          e.preventDefault();
          if (e.shiftKey) {
            actions.setBrightness(state.brightness + 10);
          } else {
            actions.setVolume(state.volume + 0.1);
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          if (e.shiftKey) {
            actions.setBrightness(state.brightness - 10);
          } else {
            actions.setVolume(state.volume - 0.1);
          }
          break;
        case 'j':
          e.preventDefault();
          actions.skipBackward(10);
          break;
        case '>':
          e.preventDefault();
          const currentIndex = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].indexOf(state.playbackRate);
          if (currentIndex < 7) {
            actions.setPlaybackRate([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2][currentIndex + 1]);
          }
          break;
        case '<':
          e.preventDefault();
          const currIndex = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].indexOf(state.playbackRate);
          if (currIndex > 0) {
            actions.setPlaybackRate([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2][currIndex - 1]);
          }
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          const percent = parseInt(e.key) / 10;
          actions.seek(state.duration * percent);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [actions, state, enabled]);
}
