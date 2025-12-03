import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { VideoGrid } from "@/components/VideoGrid";
import { Footer } from "@/components/Footer";
import { VideoPlayer as CustomVideoPlayer } from "@/components/VideoPlayer";
import { useLanguage } from "@/context/LanguageContext";
import { useGuestLimit } from "@/context/GuestLimitContext";
import { useAuth } from "@/context/AuthContext";
import { watchHistoryService, favoritesService, watchLaterService } from "@/lib/firebase";
import { 
  Eye, Clock, Tag, Share2, ThumbsUp, ThumbsDown, 
  Bookmark, Users, Heart, ChevronLeft, ChevronRight,
  Download, Flag, MoreVertical, List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Video, Category, PaginatedVideos } from "@shared/schema";

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { recordVideoWatch, hasReachedLimit, isGuest } = useGuestLimit();
  const { user, isAuthenticated } = useAuth();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeStatus, setLikeStatus] = useState<'none' | 'liked' | 'disliked'>('none');
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const { data: video, isLoading: isLoadingVideo } = useQuery<Video>({
    queryKey: ['/api/videos', id],
    queryFn: async () => {
      const response = await fetch(`/api/videos/${id}`);
      if (!response.ok) throw new Error('Video not found');
      return response.json();
    },
  });

  const { data: videosData } = useQuery<PaginatedVideos>({
    queryKey: ["/api/videos?page=1"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    if (video && id) {
      recordVideoWatch(id);

      if (isAuthenticated && user) {
        watchHistoryService.add(user.id, {
          videoId: id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          duration: video.duration,
          watchedAt: new Date().toISOString(),
          progress: 0,
          lastPosition: 0,
        });
        
        favoritesService.check(user.id, id).then(setIsFavorite);
        watchLaterService.check(user.id, id).then(setIsInWatchLater);
      } else {
        const stored = localStorage.getItem('blueberry_watch_later');
        if (stored) {
          try {
            const watchLater = JSON.parse(stored);
            setIsInWatchLater(watchLater.some((item: any) => item.videoId === id));
          } catch {}
        }

        const favStored = localStorage.getItem('blueberry_favorites');
        if (favStored) {
          try {
            const favorites = JSON.parse(favStored);
            setIsFavorite(favorites.some((item: any) => item.videoId === id));
          } catch {}
        }

        const history = JSON.parse(localStorage.getItem('blueberry_watch_history') || '[]');
        const newEntry = {
          videoId: id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          duration: video.duration,
          watchedAt: new Date().toISOString(),
          progress: 0,
        };
        const filteredHistory = history.filter((item: any) => item.videoId !== id);
        filteredHistory.unshift(newEntry);
        localStorage.setItem('blueberry_watch_history', JSON.stringify(filteredHistory.slice(0, 100)));
      }
    }
  }, [video, id, isAuthenticated, user]);

  const relatedVideos = (videosData?.videos || [])
    .filter(v => v.id !== id)
    .filter(v => {
      if (!video) return false;
      return v.categories.some(c => video.categories.includes(c)) ||
             v.tags.some(tag => video.tags.includes(tag));
    })
    .slice(0, 12);

  const handleShare = async () => {
    if (navigator.share && video) {
      try {
        await navigator.share({
          title: video.title,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Video link copied to clipboard',
      });
    }
  };

  const toggleWatchLater = async () => {
    if (!video || !id) return;

    if (isAuthenticated && user) {
      if (isInWatchLater) {
        await watchLaterService.remove(user.id, id);
        setIsInWatchLater(false);
        toast({
          title: t.video.removeFromWatchLater,
          description: 'Video removed from Watch Later',
        });
      } else {
        await watchLaterService.add(user.id, {
          videoId: id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          duration: video.duration,
          addedAt: new Date().toISOString(),
        });
        setIsInWatchLater(true);
        toast({
          title: t.video.addToWatchLater,
          description: 'Video added to Watch Later',
        });
      }
    } else {
      const stored = localStorage.getItem('blueberry_watch_later');
      let watchLater = [];
      try {
        watchLater = stored ? JSON.parse(stored) : [];
      } catch {}

      if (isInWatchLater) {
        watchLater = watchLater.filter((item: any) => item.videoId !== id);
        setIsInWatchLater(false);
        toast({
          title: t.video.removeFromWatchLater,
          description: 'Video removed from Watch Later',
        });
      } else {
        watchLater.unshift({
          videoId: id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          duration: video.duration,
          addedAt: new Date().toISOString(),
        });
        setIsInWatchLater(true);
        toast({
          title: t.video.addToWatchLater,
          description: 'Video added to Watch Later',
        });
      }

      localStorage.setItem('blueberry_watch_later', JSON.stringify(watchLater));
    }
  };

  const toggleFavorite = async () => {
    if (!video || !id) return;

    if (isAuthenticated && user) {
      if (isFavorite) {
        await favoritesService.remove(user.id, id);
        setIsFavorite(false);
        toast({
          title: 'Removed from favorites',
          description: 'Video removed from your favorites',
        });
      } else {
        await favoritesService.add(user.id, {
          videoId: id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          duration: video.duration,
          addedAt: new Date().toISOString(),
        });
        setIsFavorite(true);
        toast({
          title: 'Added to favorites',
          description: 'Video added to your favorites',
        });
      }
    } else {
      const stored = localStorage.getItem('blueberry_favorites');
      let favorites = [];
      try {
        favorites = stored ? JSON.parse(stored) : [];
      } catch {}

      if (isFavorite) {
        favorites = favorites.filter((item: any) => item.videoId !== id);
        setIsFavorite(false);
        toast({
          title: 'Removed from favorites',
          description: 'Video removed from your favorites',
        });
      } else {
        favorites.unshift({
          videoId: id,
          title: video.title,
          thumbnail: video.thumbnailUrl,
          duration: video.duration,
          addedAt: new Date().toISOString(),
        });
        setIsFavorite(true);
        toast({
          title: 'Added to favorites',
          description: 'Video added to your favorites',
        });
      }

      localStorage.setItem('blueberry_favorites', JSON.stringify(favorites));
    }
  };

  const handleLike = () => {
    setLikeStatus(likeStatus === 'liked' ? 'none' : 'liked');
    toast({
      title: likeStatus === 'liked' ? 'Like removed' : 'Liked',
      description: likeStatus === 'liked' ? 'You removed your like' : 'You liked this video',
    });
  };

  const handleDislike = () => {
    setLikeStatus(likeStatus === 'disliked' ? 'none' : 'disliked');
    toast({
      title: likeStatus === 'disliked' ? 'Dislike removed' : 'Disliked',
      description: likeStatus === 'disliked' ? 'You removed your dislike' : 'You disliked this video',
    });
  };

  const handleVideoProgress = useCallback((progress: number, currentTime: number) => {
    if (isAuthenticated && user && id) {
      watchHistoryService.updateProgress(user.id, id, progress, currentTime);
    }
  }, [isAuthenticated, user, id]);

  const handleVideoEnded = useCallback(() => {
    if (relatedVideos.length > 0) {
      const nextVideo = relatedVideos[0];
      toast({
        title: 'Up next',
        description: `Playing: ${nextVideo.title}`,
      });
      setTimeout(() => {
        navigate(`/video/${nextVideo.id}`);
      }, 3000);
    }
  }, [relatedVideos, navigate, toast]);

  const nextScreenshot = () => {
    if (video?.screenshots) {
      setCurrentScreenshot((prev) => (prev + 1) % video.screenshots!.length);
    }
  };

  const prevScreenshot = () => {
    if (video?.screenshots) {
      setCurrentScreenshot((prev) => 
        prev === 0 ? video.screenshots!.length - 1 : prev - 1
      );
    }
  };

  if (hasReachedLimit && isGuest) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          onMenuClick={() => setIsDrawerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center px-4 max-w-md">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <Users className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t.guest.limitTitle}</h2>
            <p className="text-muted-foreground mb-6">{t.guest.limitMessage}</p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/login">{t.common.login}</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/register">{t.common.register}</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoadingVideo) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          onMenuClick={() => setIsDrawerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 pt-16">
          <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6">
            <Skeleton className="w-full aspect-video rounded-xl md:rounded-2xl" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          onMenuClick={() => setIsDrawerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 pt-16 flex items-center justify-center">
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
            <h2 className="text-xl font-semibold mb-2">{t.errors.pageNotFound}</h2>
            <p className="text-muted-foreground">
              The video you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild className="mt-4">
              <a href="/">{t.errors.goHome}</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onMenuClick={() => setIsDrawerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
        selectedCategory={null}
        onCategorySelect={() => {}}
        favoritesCount={0}
      />

      <main className="flex-1 pt-16">
        <div className="max-w-[1920px] mx-auto">
          <div className="px-0 md:px-8 py-0 md:py-6">
            <div className="md:rounded-2xl overflow-hidden" data-testid="video-player-container">
              <CustomVideoPlayer
                embedCode={video.embedCode}
                embedUrl={video.embedUrl}
                title={video.title}
                thumbnail={video.thumbnailUrl}
                videoId={video.id}
                durationSeconds={video.durationSeconds || 0}
                onProgress={handleVideoProgress}
                onEnded={handleVideoEnded}
                autoplay={false}
              />
            </div>
          </div>

          <div className="px-4 md:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1
                  className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight"
                  data-testid="video-player-title"
                >
                  {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span data-testid="video-player-views">{video.views} {t.video.views}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span data-testid="video-player-duration">{video.duration}</span>
                  </div>
                </div>

                {video.actors && video.actors.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{t.video.actors}:</span>
                    {video.actors.map((actor) => (
                      <Badge
                        key={actor}
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => navigate(`/performers?q=${encodeURIComponent(actor)}`)}
                        data-testid={`video-actor-${actor.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {actor}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {video.tags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer"
                      onClick={() => navigate(`/tags?q=${encodeURIComponent(tag)}`)}
                      data-testid={`video-tag-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                <div className="flex items-center bg-muted/50 rounded-full overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-r-none gap-1.5 ${likeStatus === 'liked' ? 'bg-primary/20 text-primary' : ''}`}
                    onClick={handleLike}
                    data-testid="button-like"
                  >
                    <ThumbsUp className={`w-4 h-4 ${likeStatus === 'liked' ? 'fill-current' : ''}`} />
                    <span>{video.likes + (likeStatus === 'liked' ? 1 : 0)}</span>
                  </Button>
                  <div className="w-px h-6 bg-border" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-l-none gap-1.5 ${likeStatus === 'disliked' ? 'bg-destructive/20 text-destructive' : ''}`}
                    onClick={handleDislike}
                    data-testid="button-dislike"
                  >
                    <ThumbsDown className={`w-4 h-4 ${likeStatus === 'disliked' ? 'fill-current' : ''}`} />
                    <span>{video.dislikes + (likeStatus === 'disliked' ? 1 : 0)}</span>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full gap-2 ${
                    isFavorite 
                      ? "bg-red-500/20 text-red-500 border-red-500/30" 
                      : ""
                  }`}
                  onClick={toggleFavorite}
                  data-testid="button-favorite"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                  <span className="hidden sm:inline">
                    {isFavorite ? 'Favorited' : 'Favorite'}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full gap-2 ${
                    isInWatchLater 
                      ? "bg-primary/20 text-primary border-primary/30" 
                      : ""
                  }`}
                  onClick={toggleWatchLater}
                  data-testid="button-watch-later"
                >
                  <Bookmark className={`w-4 h-4 ${isInWatchLater ? "fill-current" : ""}`} />
                  <span className="hidden sm:inline">
                    {isInWatchLater ? 'Saved' : t.video.addToWatchLater}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2"
                  onClick={handleShare}
                  data-testid="button-share"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.video.share}</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      data-testid="button-more-options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => toast({ title: 'Added to playlist' })}>
                      <List className="w-4 h-4 mr-2" />
                      Add to Playlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast({ title: 'Download not available' })}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast({ title: 'Reported', description: 'Thank you for your feedback' })}>
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-xl">
              <p className="text-sm text-muted-foreground mb-2">{t.video.category}</p>
              <div className="flex flex-wrap gap-2">
                {video.categories.map((cat) => (
                  <Badge 
                    key={cat} 
                    className="bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                    onClick={() => navigate(`/category/${encodeURIComponent(cat)}`)}
                    data-testid={`video-category-${cat}`}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {video.screenshots && video.screenshots.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-muted-foreground">Screenshots</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowScreenshots(!showScreenshots)}
                    data-testid="button-toggle-screenshots"
                  >
                    {showScreenshots ? 'Show less' : 'Show all'}
                  </Button>
                </div>
                
                {showScreenshots ? (
                  <div className="relative">
                    <img
                      src={video.screenshots[currentScreenshot]}
                      alt={`Screenshot ${currentScreenshot + 1}`}
                      className="w-full rounded-xl aspect-video object-cover"
                      data-testid="screenshot-large"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-black/50 text-white hover:bg-black/70 ml-2"
                        onClick={prevScreenshot}
                        data-testid="button-prev-screenshot"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="bg-black/50 text-white hover:bg-black/70 mr-2"
                        onClick={nextScreenshot}
                        data-testid="button-next-screenshot"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                      {currentScreenshot + 1} / {video.screenshots.length}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {video.screenshots.slice(0, 6).map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="rounded-lg aspect-video object-cover hover:opacity-80 transition-opacity cursor-pointer"
                        onClick={() => {
                          setCurrentScreenshot(index);
                          setShowScreenshots(true);
                        }}
                        data-testid={`video-screenshot-${index}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {relatedVideos.length > 0 && (
            <div className="border-t border-white/5 mt-6">
              <VideoGrid 
                title={t.video.relatedVideos} 
                videos={relatedVideos} 
                sectionId="related" 
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
