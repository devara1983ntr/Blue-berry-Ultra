import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { 
  Maximize, Minimize, Loader2, AlertCircle, Monitor,
  RefreshCw, ChevronUp, ChevronDown, Settings, Sun,
  Volume2, VolumeX, Volume1, Play, Pause, SkipBack,
  SkipForward, Rewind, FastForward, PictureInPicture2,
  Subtitles, Gauge, Lock, Unlock, RotateCcw, Info,
  Smartphone, Tv, Cast, Download, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Eye, EyeOff, Repeat, Shuffle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useVideoGestures } from "@/hooks/use-gestures";
import { usePlayback } from "@/context/PlaybackContext";

function extractIframeSrc(embedCode: string): string | null {
  const srcMatch = embedCode.match(/src=["']([^"']+)["']/);
  return srcMatch ? srcMatch[1] : null;
}

type VideoQuality = "auto" | "2160p" | "1440p" | "1080p" | "720p" | "480p" | "360p" | "240p";
type AudioQuality = "high" | "medium" | "low";
type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;
type FitMode = "contain" | "cover" | "fill";

interface VideoPlayerProps {
  embedCode?: string;
  embedUrl?: string;
  title: string;
  thumbnail?: string;
  screenshots?: string[];
  videoId: string;
  durationSeconds?: number;
  onProgress?: (progress: number, currentTime: number) => void;
  onEnded?: () => void;
  initialProgress?: number;
  autoplay?: boolean;
}

const QUALITY_OPTIONS: { value: VideoQuality; label: string; resolution: string }[] = [
  { value: "auto", label: "Auto", resolution: "Adaptive" },
  { value: "2160p", label: "4K Ultra HD", resolution: "3840x2160" },
  { value: "1440p", label: "2K QHD", resolution: "2560x1440" },
  { value: "1080p", label: "Full HD", resolution: "1920x1080" },
  { value: "720p", label: "HD", resolution: "1280x720" },
  { value: "480p", label: "SD", resolution: "854x480" },
  { value: "360p", label: "Low", resolution: "640x360" },
  { value: "240p", label: "Very Low", resolution: "426x240" },
];

const AUDIO_OPTIONS: { value: AudioQuality; label: string; bitrate: string }[] = [
  { value: "high", label: "High Quality", bitrate: "320 kbps" },
  { value: "medium", label: "Medium", bitrate: "192 kbps" },
  { value: "low", label: "Low", bitrate: "128 kbps" },
];

const SPEED_OPTIONS: { value: PlaybackSpeed; label: string }[] = [
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "Normal" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 1.75, label: "1.75x" },
  { value: 2, label: "2x" },
];

export function VideoPlayer({
  embedCode,
  embedUrl,
  title,
  thumbnail,
  screenshots = [],
  videoId,
  durationSeconds = 0,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const gestureIndicatorTimeout = useRef<NodeJS.Timeout | null>(null);
  const progressSaveInterval = useRef<NodeJS.Timeout | null>(null);
  
  const { settings, updateSettings, saveProgress, getProgress } = usePlayback();
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(() => settings.theater);
  const [brightness, setBrightness] = useState(() => settings.brightness);
  const [volume, setVolume] = useState(() => settings.volume);
  const [isMuted, setIsMuted] = useState(() => settings.muted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPiPMode, setIsPiPMode] = useState(() => settings.miniPlayer);
  const [isControlsLocked, setIsControlsLocked] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [isLooping, setIsLooping] = useState(() => settings.loop);
  const [showSubtitles, setShowSubtitles] = useState(() => settings.subtitles);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  
  const [quality, setQuality] = useState<VideoQuality>(() => settings.quality);
  const [audioQuality, setAudioQuality] = useState<AudioQuality>(() => settings.audioQuality);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(() => settings.playbackSpeed);
  
  const [gestureIndicator, setGestureIndicator] = useState<{
    type: "seek" | "volume" | "brightness" | "zoom" | null;
    value: string;
    direction: "left" | "right" | "up" | "down" | null;
  }>({ type: null, value: "", direction: null });
  
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [showScreenshotPreview, setShowScreenshotPreview] = useState(false);
  
  const [stats, setStats] = useState({
    resolution: "1080p",
    bitrate: "4.5 Mbps",
    fps: "30",
    buffered: "15s",
    dropped: "0",
    latency: "45ms",
  });

  useEffect(() => {
    const existingProgress = getProgress(videoId);
    if (existingProgress) {
      setSimulatedProgress(existingProgress.progress);
    }
  }, [videoId, getProgress]);

  useEffect(() => {
    if (videoId && title && thumbnail && isPlaying) {
      progressSaveInterval.current = setInterval(() => {
        const currentTime = (simulatedProgress / 100) * durationSeconds;
        saveProgress({
          videoId,
          progress: Math.min(simulatedProgress + 1, 100),
          currentTime,
          duration: durationSeconds,
          lastWatched: new Date().toISOString(),
          title,
          thumbnail,
        });
        setSimulatedProgress(prev => Math.min(prev + 1, 100));
      }, 10000);
    }

    return () => {
      if (progressSaveInterval.current) {
        clearInterval(progressSaveInterval.current);
      }
    };
  }, [videoId, title, thumbnail, isPlaying, simulatedProgress, durationSeconds, saveProgress]);

  useEffect(() => {
    if (videoId && title && thumbnail) {
      const currentTime = (simulatedProgress / 100) * durationSeconds;
      saveProgress({
        videoId,
        progress: Math.max(simulatedProgress, 5),
        currentTime,
        duration: durationSeconds,
        lastWatched: new Date().toISOString(),
        title,
        thumbnail,
      });
    }
  }, []);

  useEffect(() => {
    updateSettings({
      quality,
      audioQuality,
      playbackSpeed,
      loop: isLooping,
      muted: isMuted,
      volume,
      brightness,
      theater: isTheaterMode,
      miniPlayer: isPiPMode,
      subtitles: showSubtitles,
    });
  }, [quality, audioQuality, playbackSpeed, isLooping, isMuted, volume, brightness, isTheaterMode, isPiPMode, showSubtitles, updateSettings]);

  useEffect(() => {
    return () => {
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
      if (gestureIndicatorTimeout.current) clearTimeout(gestureIndicatorTimeout.current);
      if (progressSaveInterval.current) clearInterval(progressSaveInterval.current);
    };
  }, []);

  const showGestureIndicator = useCallback((type: typeof gestureIndicator.type, value: string, direction: typeof gestureIndicator.direction = null) => {
    setGestureIndicator({ type, value, direction });
    if (gestureIndicatorTimeout.current) {
      clearTimeout(gestureIndicatorTimeout.current);
    }
    gestureIndicatorTimeout.current = setTimeout(() => {
      setGestureIndicator({ type: null, value: "", direction: null });
    }, 1000);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    if (isControlsLocked) return;
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (!isControlsLocked) {
        setShowControls(false);
      }
    }, 4000);
  }, [isControlsLocked]);

  const handleMouseMove = useCallback(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  const handleMouseLeave = useCallback(() => {
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    if (!isControlsLocked) {
      setShowControls(false);
    }
  }, [isControlsLocked]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  const togglePiP = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiPMode(false);
      } else {
        setIsPiPMode(!isPiPMode);
        showGestureIndicator("zoom", isPiPMode ? "PiP Off" : "PiP On");
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  }, [isPiPMode, showGestureIndicator]);

  const handleSeekForward = useCallback(() => {
    showGestureIndicator("seek", "+10s", "right");
  }, [showGestureIndicator]);

  const handleSeekBackward = useCallback(() => {
    showGestureIndicator("seek", "-10s", "left");
  }, [showGestureIndicator]);

  const handleVolumeChange = useCallback((delta: number) => {
    const newVolume = Math.max(0, Math.min(100, volume + delta * 100));
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    showGestureIndicator("volume", `${Math.round(newVolume)}%`, delta > 0 ? "up" : "down");
  }, [volume, showGestureIndicator]);

  const handleBrightnessChange = useCallback((delta: number) => {
    const newBrightness = Math.max(10, Math.min(150, brightness + delta));
    setBrightness(newBrightness);
    showGestureIndicator("brightness", `${Math.round(newBrightness)}%`, delta > 0 ? "up" : "down");
  }, [brightness, showGestureIndicator]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
    showGestureIndicator("seek", isPlaying ? "Paused" : "Playing");
  }, [isPlaying, showGestureIndicator]);

  const handleDoubleTapLeft = useCallback(() => {
    handleSeekBackward();
  }, [handleSeekBackward]);

  const handleDoubleTapRight = useCallback(() => {
    handleSeekForward();
  }, [handleSeekForward]);

  const handleLongPress = useCallback(() => {
    setShowScreenshotPreview(true);
    if (screenshots.length > 0) {
      setCurrentScreenshot(0);
    }
  }, [screenshots]);

  const handlePinchZoom = useCallback((scale: number) => {
    if (scale > 1.2) {
      setFitMode("cover");
      showGestureIndicator("zoom", "Zoom In");
    } else if (scale < 0.8) {
      setFitMode("contain");
      showGestureIndicator("zoom", "Zoom Out");
    }
  }, [showGestureIndicator]);

  useVideoGestures(containerRef, {
    onSeekForward: handleSeekForward,
    onSeekBackward: handleSeekBackward,
    onVolumeChange: handleVolumeChange,
    onBrightnessChange: handleBrightnessChange,
    onTogglePlay: handleTogglePlay,
    onDoubleTapLeft: handleDoubleTapLeft,
    onDoubleTapRight: handleDoubleTapRight,
    onLongPress: handleLongPress,
    onPinchZoom: handlePinchZoom,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA') {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'f':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 't':
        e.preventDefault();
        setIsTheaterMode(!isTheaterMode);
        break;
      case ' ':
      case 'k':
        e.preventDefault();
        handleTogglePlay();
        break;
      case 'arrowup':
        e.preventDefault();
        handleBrightnessChange(10);
        break;
      case 'arrowdown':
        e.preventDefault();
        handleBrightnessChange(-10);
        break;
      case 'arrowleft':
        e.preventDefault();
        handleSeekBackward();
        break;
      case 'arrowright':
        e.preventDefault();
        handleSeekForward();
        break;
      case 'm':
        e.preventDefault();
        setIsMuted(!isMuted);
        break;
      case 'l':
        e.preventDefault();
        setIsControlsLocked(!isControlsLocked);
        break;
      case 'p':
        e.preventDefault();
        togglePiP();
        break;
      case 's':
        e.preventDefault();
        setShowStats(!showStats);
        break;
      case 'c':
        e.preventDefault();
        setShowSubtitles(!showSubtitles);
        break;
      case 'r':
        e.preventDefault();
        setIsLooping(!isLooping);
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
        const percent = parseInt(e.key) * 10;
        showGestureIndicator("seek", `${percent}%`);
        break;
      case '+':
      case '=':
        e.preventDefault();
        const nextSpeedIdx = SPEED_OPTIONS.findIndex(s => s.value === playbackSpeed);
        if (nextSpeedIdx < SPEED_OPTIONS.length - 1) {
          const newSpeed = SPEED_OPTIONS[nextSpeedIdx + 1].value;
          setPlaybackSpeed(newSpeed);
          showGestureIndicator("seek", `${newSpeed}x`);
        }
        break;
      case '-':
        e.preventDefault();
        const prevSpeedIdx = SPEED_OPTIONS.findIndex(s => s.value === playbackSpeed);
        if (prevSpeedIdx > 0) {
          const newSpeed = SPEED_OPTIONS[prevSpeedIdx - 1].value;
          setPlaybackSpeed(newSpeed);
          showGestureIndicator("seek", `${newSpeed}x`);
        }
        break;
    }
  }, [brightness, isTheaterMode, toggleFullscreen, isMuted, isControlsLocked, showStats, showSubtitles, isLooping, playbackSpeed, handleTogglePlay, handleBrightnessChange, handleSeekBackward, handleSeekForward, togglePiP, showGestureIndicator]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!embedCode && !embedUrl) {
      setHasError(true);
      setIsLoading(false);
    }
  }, [embedCode, embedUrl]);

  useEffect(() => {
    const savedQuality = localStorage.getItem('blueberry_video_quality');
    const savedAudio = localStorage.getItem('blueberry_audio_quality');
    const savedSpeed = localStorage.getItem('blueberry_playback_speed');
    
    if (savedQuality) setQuality(savedQuality as VideoQuality);
    if (savedAudio) setAudioQuality(savedAudio as AudioQuality);
    if (savedSpeed) setPlaybackSpeed(parseFloat(savedSpeed) as PlaybackSpeed);
  }, []);

  useEffect(() => {
    localStorage.setItem('blueberry_video_quality', quality);
  }, [quality]);

  useEffect(() => {
    localStorage.setItem('blueberry_audio_quality', audioQuality);
  }, [audioQuality]);

  useEffect(() => {
    localStorage.setItem('blueberry_playback_speed', String(playbackSpeed));
  }, [playbackSpeed]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const extractedEmbedSrc = useMemo(() => {
    if (embedCode) {
      return extractIframeSrc(embedCode);
    }
    return null;
  }, [embedCode]);

  const finalEmbedUrl = useMemo(() => {
    const url = extractedEmbedSrc || embedUrl;
    if (url) {
      return url + (url.includes('?') ? '&' : '?') + 'autoplay=0';
    }
    return null;
  }, [extractedEmbedSrc, embedUrl]);

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  if (hasError || (!embedCode && !embedUrl)) {
    return (
      <div 
        className="relative w-full aspect-video bg-black/90 rounded-xl flex flex-col items-center justify-center gap-4"
        data-testid="video-player-error"
      >
        <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <p className="text-white text-lg font-medium">Video unavailable</p>
        <p className="text-white/60 text-sm">This video cannot be played at this time</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-2"
          data-testid="button-retry-video"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full bg-black group select-none touch-none",
        isTheaterMode ? "aspect-[21/9]" : "aspect-video",
        isFullscreen && "fixed inset-0 z-50",
        isMinimized && "fixed bottom-4 right-4 w-80 aspect-video z-50 rounded-xl overflow-hidden shadow-2xl"
      )}
      style={{ 
        filter: `brightness(${brightness}%)`,
        objectFit: fitMode,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={showControlsTemporarily}
      tabIndex={0}
      data-testid="video-player-container"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-white/80 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {thumbnail && isLoading && (
        <img 
          src={thumbnail} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          data-testid="video-player-thumbnail"
        />
      )}

      <div className={cn(
        "absolute inset-0 w-full h-full",
        fitMode === "cover" && "object-cover",
        fitMode === "fill" && "object-fill"
      )}>
        {finalEmbedUrl ? (
          <iframe
            src={finalEmbedUrl}
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            data-testid="video-iframe"
          />
        ) : null}
      </div>

      {gestureIndicator.type && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-6 py-4 flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-200">
            {gestureIndicator.type === "seek" && (
              gestureIndicator.direction === "left" ? (
                <Rewind className="w-8 h-8 text-white" />
              ) : gestureIndicator.direction === "right" ? (
                <FastForward className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )
            )}
            {gestureIndicator.type === "volume" && (
              <VolumeIcon className="w-8 h-8 text-white" />
            )}
            {gestureIndicator.type === "brightness" && (
              <Sun className="w-8 h-8 text-white" />
            )}
            {gestureIndicator.type === "zoom" && (
              gestureIndicator.value.includes("In") ? (
                <ZoomIn className="w-8 h-8 text-white" />
              ) : (
                <ZoomOut className="w-8 h-8 text-white" />
              )
            )}
            <span className="text-white font-medium text-lg">{gestureIndicator.value}</span>
          </div>
        </div>
      )}

      {showScreenshotPreview && screenshots.length > 0 && (
        <div className="absolute inset-0 bg-black/90 z-40 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
            onClick={() => setCurrentScreenshot((prev) => prev === 0 ? screenshots.length - 1 : prev - 1)}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          <img 
            src={screenshots[currentScreenshot]} 
            alt={`Preview ${currentScreenshot + 1}`}
            className="max-h-full max-w-full object-contain"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            onClick={() => setCurrentScreenshot((prev) => (prev + 1) % screenshots.length)}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 text-white"
            onClick={() => setShowScreenshotPreview(false)}
          >
            Close
          </Button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentScreenshot + 1} / {screenshots.length}
          </div>
        </div>
      )}

      {showStats && (
        <div className="absolute top-16 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 z-30 text-xs text-white/80 space-y-1 font-mono">
          <div className="text-white font-semibold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Stats for Nerds
          </div>
          <div>Quality: {QUALITY_OPTIONS.find(q => q.value === quality)?.label}</div>
          <div>Resolution: {stats.resolution}</div>
          <div>Bitrate: {stats.bitrate}</div>
          <div>FPS: {stats.fps}</div>
          <div>Buffered: {stats.buffered}</div>
          <div>Dropped frames: {stats.dropped}</div>
          <div>Latency: {stats.latency}</div>
          <div>Audio: {AUDIO_OPTIONS.find(a => a.value === audioQuality)?.bitrate}</div>
          <div>Speed: {playbackSpeed}x</div>
        </div>
      )}

      {isControlsLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
          <Button
            size="lg"
            variant="ghost"
            className="bg-black/50 text-white rounded-full p-4"
            onClick={() => setIsControlsLocked(false)}
            data-testid="button-unlock-controls"
          >
            <Lock className="w-8 h-8" />
          </Button>
        </div>
      )}

      <div 
        className={cn(
          "absolute top-0 left-0 right-0 p-3 z-10 transition-opacity duration-300 flex items-center justify-between",
          showControls && !isControlsLocked ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2">
          {quality !== "auto" && (
            <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
              {QUALITY_OPTIONS.find(q => q.value === quality)?.label}
            </Badge>
          )}
          {playbackSpeed !== 1 && (
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs">
              {playbackSpeed}x
            </Badge>
          )}
          {showSubtitles && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs">
              CC
            </Badge>
          )}
          {isLooping && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
              Loop
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="bg-black/50 text-white hover:bg-black/70"
                data-testid="button-video-settings"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Video Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Tv className="w-4 h-4 mr-2" />
                  Quality: {QUALITY_OPTIONS.find(q => q.value === quality)?.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {QUALITY_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setQuality(option.value)}
                      className={quality === option.value ? "bg-primary/20 text-primary" : ""}
                    >
                      <div className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.resolution}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio: {AUDIO_OPTIONS.find(a => a.value === audioQuality)?.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {AUDIO_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setAudioQuality(option.value)}
                      className={audioQuality === option.value ? "bg-primary/20 text-primary" : ""}
                    >
                      <div className="flex justify-between w-full">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.bitrate}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Gauge className="w-4 h-4 mr-2" />
                  Speed: {playbackSpeed}x
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {SPEED_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setPlaybackSpeed(option.value)}
                      className={playbackSpeed === option.value ? "bg-primary/20 text-primary" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsTheaterMode(!isTheaterMode)}>
                <Monitor className="w-4 h-4 mr-2" />
                Theater Mode
                {isTheaterMode && <span className="ml-auto text-primary">On</span>}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowSubtitles(!showSubtitles)}>
                <Subtitles className="w-4 h-4 mr-2" />
                Subtitles
                {showSubtitles && <span className="ml-auto text-primary">On</span>}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsLooping(!isLooping)}>
                <Repeat className="w-4 h-4 mr-2" />
                Loop
                {isLooping && <span className="ml-auto text-primary">On</span>}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setShowStats(!showStats)}>
                <Info className="w-4 h-4 mr-2" />
                Stats for Nerds
                {showStats && <span className="ml-auto text-primary">On</span>}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <div className="px-2 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Brightness
                  </span>
                  <span className="text-xs text-muted-foreground">{brightness}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6" 
                    onClick={() => setBrightness(Math.max(10, brightness - 10))}
                    data-testid="button-brightness-down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[brightness]}
                    min={10}
                    max={150}
                    onValueChange={([val]) => setBrightness(val)}
                    className="flex-1"
                    data-testid="slider-brightness"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6" 
                    onClick={() => setBrightness(Math.min(150, brightness + 10))}
                    data-testid="button-brightness-up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="px-2 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm flex items-center gap-2">
                    <VolumeIcon className="w-4 h-4" />
                    Volume
                  </span>
                  <span className="text-xs text-muted-foreground">{isMuted ? 0 : volume}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-6 w-6" 
                    onClick={() => setIsMuted(!isMuted)}
                    data-testid="button-mute"
                  >
                    <VolumeIcon className="w-4 h-4" />
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={100}
                    onValueChange={([val]) => {
                      setVolume(val);
                      setIsMuted(val === 0);
                    }}
                    className="flex-1"
                    data-testid="slider-volume"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="icon"
            variant="ghost"
            className="bg-black/50 text-white hover:bg-black/70"
            onClick={() => setIsControlsLocked(!isControlsLocked)}
            data-testid="button-lock-controls"
          >
            {isControlsLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="bg-black/50 text-white hover:bg-black/70"
            onClick={togglePiP}
            data-testid="button-pip"
          >
            <PictureInPicture2 className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "bg-black/50 text-white hover:bg-black/70",
              isTheaterMode && "bg-primary/50"
            )}
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            data-testid="button-theater-mode"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="bg-black/50 text-white hover:bg-black/70"
            onClick={toggleFullscreen}
            data-testid="button-fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-10 transition-opacity duration-300",
          showControls && !isControlsLocked ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between gap-4 text-white/80 text-xs mb-2">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white"
              onClick={handleSeekBackward}
              data-testid="button-seek-backward"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-white hover:text-white"
              onClick={handleTogglePlay}
              data-testid="button-play-pause"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white"
              onClick={handleSeekForward}
              data-testid="button-seek-forward"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 flex-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white hover:text-white"
              onClick={() => setIsMuted(!isMuted)}
              data-testid="button-volume-toggle"
            >
              <VolumeIcon className="w-4 h-4" />
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={100}
              onValueChange={([val]) => {
                setVolume(val);
                setIsMuted(val === 0);
              }}
              className="w-24"
              data-testid="slider-volume-bottom"
            />
          </div>

          <div className="flex items-center gap-2 text-white/60">
            <span>F: Fullscreen</span>
            <span className="hidden md:inline">T: Theater</span>
            <span className="hidden md:inline">M: Mute</span>
            <span className="hidden md:inline">L: Lock</span>
            <span className="hidden lg:inline">S: Stats</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
