import { VideoCard, VideoCardSkeleton } from "./VideoCard";
import type { Video } from "@shared/schema";

interface VideoGridProps {
  title?: string;
  videos: Video[];
  isLoading?: boolean;
  emptyMessage?: string;
  sectionId?: string;
}

export function VideoGrid({ 
  title, 
  videos, 
  isLoading = false,
  emptyMessage = "No videos found",
  sectionId = "grid"
}: VideoGridProps) {
  if (isLoading) {
    return (
      <section className="py-6 md:py-8" data-testid="video-grid-loading">
        {title && (
          <h2 className="text-xl md:text-2xl font-semibold font-['Poppins'] mb-6 px-4 md:px-8">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-4 md:px-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className="py-12" data-testid="video-grid-empty">
        <div className="text-center px-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full glass flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
              />
            </svg>
          </div>
          <p className="text-lg text-muted-foreground">{emptyMessage}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 md:py-8" data-testid={`video-grid-${sectionId}`}>
      {title && (
        <h2 
          className="text-xl md:text-2xl font-semibold font-['Poppins'] mb-6 px-4 md:px-8"
          data-testid="video-grid-title"
        >
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 px-4 md:px-8">
        {videos.map((video, index) => (
          <VideoCard key={`${sectionId}-${video.id}`} video={video} index={index} sectionId={sectionId} />
        ))}
      </div>
    </section>
  );
}
