import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, Search, Trash2, Play, Bookmark } from 'lucide-react';

interface WatchLaterItem {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  addedAt: string;
}

export default function WatchLater() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('blueberry_watch_later');
    if (stored) {
      try {
        setWatchLater(JSON.parse(stored));
      } catch {
        setWatchLater([]);
      }
    }
  }, []);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return watchLater;
    const query = searchQuery.toLowerCase();
    return watchLater.filter(item => 
      item.title.toLowerCase().includes(query)
    );
  }, [watchLater, searchQuery]);

  const handleClearAll = () => {
    setWatchLater([]);
    localStorage.removeItem('blueberry_watch_later');
    toast({
      title: 'List cleared',
      description: 'Your Watch Later list has been cleared.',
    });
  };

  const handleRemoveItem = (videoId: string) => {
    const updated = watchLater.filter(item => item.videoId !== videoId);
    setWatchLater(updated);
    localStorage.setItem('blueberry_watch_later', JSON.stringify(updated));
    toast({
      title: 'Removed',
      description: 'Video removed from Watch Later.',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" data-testid="button-back-home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="text-watch-later-title">
                <Clock className="w-8 h-8 text-primary" />
                {t.common.watchLater}
              </h1>
              <p className="text-sm text-muted-foreground">
                {watchLater.length} videos saved
              </p>
            </div>
          </div>
          {watchLater.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              data-testid="button-clear-watch-later"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {watchLater.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search saved videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-watch-later"
            />
          </div>
        )}

        {filteredList.length === 0 ? (
          <Card data-testid="card-empty-watch-later">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bookmark className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No results found' : 'No saved videos'}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Save videos to watch later and they will appear here.'
                }
              </p>
              <Button asChild className="mt-6">
                <Link href="/" data-testid="link-browse-videos">
                  Browse Videos
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((item) => (
              <Card key={item.videoId} className="overflow-hidden hover-elevate" data-testid={`card-watch-later-${item.videoId}`}>
                <Link href={`/video/${item.videoId}`}>
                  <div className="relative aspect-video group">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
                      {item.duration}
                    </div>
                  </div>
                </Link>
                <CardContent className="p-3">
                  <Link href={`/video/${item.videoId}`}>
                    <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors text-sm">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      Added {formatDate(item.addedAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveItem(item.videoId)}
                      data-testid={`button-remove-watch-later-${item.videoId}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
