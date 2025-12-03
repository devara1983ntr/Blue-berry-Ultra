import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { SideDrawer } from "@/components/SideDrawer";
import { Footer } from "@/components/Footer";
import { VideoCard } from "@/components/VideoCard";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { favoritesService, FavoriteItem } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft, Search, Trash2, Grid3X3, List } from "lucide-react";
import type { Category, Video } from "@shared/schema";

export default function Favorites() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      if (isAuthenticated && user) {
        const items = await favoritesService.get(user.id);
        setFavorites(items);
      } else {
        const stored = localStorage.getItem('blueberry_favorites');
        if (stored) {
          try {
            setFavorites(JSON.parse(stored));
          } catch {
            setFavorites([]);
          }
        }
      }
      setIsLoading(false);
    };

    loadFavorites();
  }, [isAuthenticated, user]);

  const filteredFavorites = favorites.filter(item =>
    item.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleRemove = async (videoId: string) => {
    if (isAuthenticated && user) {
      await favoritesService.remove(user.id, videoId);
      setFavorites(prev => prev.filter(item => item.videoId !== videoId));
    } else {
      const updated = favorites.filter(item => item.videoId !== videoId);
      setFavorites(updated);
      localStorage.setItem('blueberry_favorites', JSON.stringify(updated));
    }
    toast({
      title: 'Removed from favorites',
      description: 'Video has been removed from your favorites',
    });
  };

  const handleClearAll = async () => {
    if (isAuthenticated && user) {
      for (const item of favorites) {
        await favoritesService.remove(user.id, item.videoId);
      }
    } else {
      localStorage.removeItem('blueberry_favorites');
    }
    setFavorites([]);
    toast({
      title: 'Favorites cleared',
      description: 'All favorites have been removed',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const mockVideoFromFavorite = (item: FavoriteItem): Partial<Video> => ({
    id: item.videoId,
    title: item.title,
    thumbnailUrl: item.thumbnail,
    duration: item.duration,
    views: '',
    viewsCount: 0,
    likes: 0,
    dislikes: 0,
    categories: [],
    tags: [],
    actors: [],
  });

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
        favoritesCount={favorites.length}
      />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/" data-testid="button-back">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" data-testid="text-favorites-title">
                  <Heart className="w-8 h-8 text-red-500" />
                  Favorites
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {favorites.length} videos saved
                </p>
              </div>
            </div>

            {favorites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
                data-testid="button-clear-favorites"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {favorites.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search favorites..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-favorites"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  data-testid="button-view-grid"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  data-testid="button-view-list"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start adding videos to your favorites by clicking the heart icon on any video
              </p>
              <Button asChild>
                <Link href="/">Browse Videos</Link>
              </Button>
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try a different search term
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFavorites.map((item) => (
                <div key={item.videoId} className="relative group">
                  <VideoCard
                    video={mockVideoFromFavorite(item) as Video}
                    sectionId="favorites"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(item.videoId);
                    }}
                    data-testid={`button-remove-${item.videoId}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Added {formatDate(item.addedAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFavorites.map((item) => (
                <div
                  key={item.videoId}
                  className="flex items-center gap-4 p-3 rounded-lg bg-card hover-elevate cursor-pointer"
                  onClick={() => navigate(`/video/${item.videoId}`)}
                  data-testid={`favorite-list-${item.videoId}`}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-32 h-20 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.duration} | Added {formatDate(item.addedAt)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(item.videoId);
                    }}
                    data-testid={`button-remove-list-${item.videoId}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
