import { useGuestLimit } from '@/context/GuestLimitContext';
import { useLanguage } from '@/context/LanguageContext';
import { Film } from 'lucide-react';

export function GuestLimitBanner() {
  const { videosWatched, totalVideosAvailable } = useGuestLimit();
  const { t } = useLanguage();

  if (videosWatched === 0) return null;

  return (
    <div 
      className="fixed bottom-20 left-4 z-40 md:left-4 md:max-w-xs pointer-events-none"
      data-testid="banner-videos-watched"
    >
      <div className="glass-dark rounded-full px-4 py-2 flex items-center gap-2 text-sm">
        <Film className="w-4 h-4 text-primary" />
        <span className="text-muted-foreground">
          {videosWatched.toLocaleString()} / {totalVideosAvailable.toLocaleString()} {t.video.views || 'videos'}
        </span>
      </div>
    </div>
  );
}
