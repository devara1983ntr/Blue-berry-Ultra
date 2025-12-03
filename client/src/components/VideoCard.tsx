import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Play, Clock, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesContext } from "@/context/FavoritesContext";
import type { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  index?: number;
  sectionId?: string;
}

export function VideoCard({ video, index = 0, sectionId = "default" }: VideoCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const isLiked = isFavorite(video.id);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "200px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(video.id);
  };

  return (
    <article
      ref={cardRef}
      className="group cursor-pointer video-card-hover rounded-xl overflow-visible"
      style={{ 
        animationDelay: `${index * 50}ms`,
        animation: "fadeUp 0.4s ease-out forwards",
        opacity: 0
      }}
      data-testid={`video-card-${sectionId}-${video.id}`}
    >
      <Link href={`/video/${video.id}`}>
        {/* Thumbnail container */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-card">
          {/* Skeleton placeholder */}
          {(!isVisible || !isLoaded) && (
            <div className="absolute inset-0 bg-gradient-to-br from-card to-muted animate-pulse">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <Play className="w-5 h-5 text-muted-foreground/50" />
                </div>
              </div>
            </div>
          )}
          
          {/* Thumbnail image - only load when visible */}
          {isVisible && (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              data-testid={`video-thumbnail-${video.id}`}
            />
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-14 h-14 rounded-full glass-heavy flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
          
          {/* Favorite button - top right */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 h-8 w-8 rounded-full transition-all duration-200 ${
              isLiked 
                ? "bg-red-500/90 text-white opacity-100" 
                : "glass opacity-0 group-hover:opacity-100"
            }`}
            data-testid={`button-favorite-${video.id}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 glass px-2 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3 text-white/80" />
            <span className="text-xs font-medium text-white" data-testid={`video-duration-${video.id}`}>
              {video.duration}
            </span>
          </div>
        </div>
      </Link>

      {/* Video info */}
      <Link href={`/video/${video.id}`}>
        <div className="pt-3 px-1">
          <h3 
            className="font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-150"
            data-testid={`video-title-${video.id}`}
          >
            {video.title}
          </h3>
          
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span data-testid={`video-views-${video.id}`}>{video.views}</span>
            </div>
            {video.category && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                <span data-testid={`video-category-${video.id}`} className="truncate">{video.category}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-video rounded-xl bg-gradient-to-br from-card to-muted">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Play className="w-5 h-5 text-muted-foreground/50" />
          </div>
        </div>
      </div>
      <div className="pt-3 px-1">
        <div className="h-4 bg-card rounded w-full mb-2" />
        <div className="h-4 bg-card rounded w-2/3 mb-2" />
        <div className="h-3 bg-card rounded w-1/2" />
      </div>
    </div>
  );
}
