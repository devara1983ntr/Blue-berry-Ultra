import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, History as HistoryIcon, Search, Trash2, Play, Clock } from 'lucide-react';

interface WatchHistoryItem {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  watchedAt: string;
  progress: number;
}

export default function History() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('blueberry_watch_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter(item => 
      item.title.toLowerCase().includes(query)
    );
  }, [history, searchQuery]);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('blueberry_watch_history');
    toast({
      title: 'History cleared',
      description: 'Your watch history has been cleared.',
    });
  };

  const handleRemoveItem = (videoId: string) => {
    const updated = history.filter(item => item.videoId !== videoId);
    setHistory(updated);
    localStorage.setItem('blueberry_watch_history', JSON.stringify(updated));
    toast({
      title: 'Removed from history',
      description: 'Video removed from your watch history.',
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
              <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="text-history-title">
                <HistoryIcon className="w-8 h-8 text-primary" />
                {t.common.history}
              </h1>
              <p className="text-sm text-muted-foreground">
                {history.length} videos in your history
              </p>
            </div>
          </div>
          {history.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearHistory}
              data-testid="button-clear-all-history"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {history.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-history"
            />
          </div>
        )}

        {filteredHistory.length === 0 ? (
          <Card data-testid="card-empty-history">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HistoryIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No results found' : 'No watch history'}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Videos you watch will appear here so you can easily find them again.'
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
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.videoId} className="hover-elevate" data-testid={`card-history-${item.videoId}`}>
                <CardContent className="p-3">
                  <div className="flex gap-4">
                    <Link href={`/video/${item.videoId}`}>
                      <div className="relative w-40 aspect-video rounded-md overflow-hidden shrink-0 group">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white">
                          {item.duration}
                        </div>
                        {item.progress > 0 && item.progress < 100 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/video/${item.videoId}`}>
                        <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formatDate(item.watchedAt)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.videoId)}
                      data-testid={`button-remove-history-${item.videoId}`}
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
