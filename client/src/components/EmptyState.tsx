import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, Video, Heart, Clock, Bell, History, 
  Bookmark, FolderOpen, type LucideIcon 
} from 'lucide-react';
import { Link } from 'wouter';

interface EmptyStateProps {
  type?: 'search' | 'videos' | 'favorites' | 'watchLater' | 'notifications' | 'history' | 'category' | 'generic';
  title?: string;
  message?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const emptyStateConfigs: Record<string, { 
  icon: LucideIcon; 
  defaultTitle: string; 
  defaultMessage: string 
}> = {
  search: {
    icon: Search,
    defaultTitle: 'No results found',
    defaultMessage: 'Try adjusting your search terms or browse categories.',
  },
  videos: {
    icon: Video,
    defaultTitle: 'No videos available',
    defaultMessage: 'Check back later for new content.',
  },
  favorites: {
    icon: Heart,
    defaultTitle: 'No favorites yet',
    defaultMessage: 'Videos you like will appear here.',
  },
  watchLater: {
    icon: Clock,
    defaultTitle: 'Watch Later is empty',
    defaultMessage: 'Save videos to watch later and they will appear here.',
  },
  notifications: {
    icon: Bell,
    defaultTitle: 'No notifications',
    defaultMessage: 'You are all caught up! Check back later.',
  },
  history: {
    icon: History,
    defaultTitle: 'No watch history',
    defaultMessage: 'Videos you watch will appear here.',
  },
  category: {
    icon: FolderOpen,
    defaultTitle: 'Category is empty',
    defaultMessage: 'No videos in this category yet.',
  },
  generic: {
    icon: Bookmark,
    defaultTitle: 'Nothing here',
    defaultMessage: 'This section is empty.',
  },
};

export function EmptyState({ 
  type = 'generic', 
  title, 
  message, 
  actionLabel = 'Browse Videos',
  actionHref = '/',
  onAction
}: EmptyStateProps) {
  const config = emptyStateConfigs[type] || emptyStateConfigs.generic;
  const Icon = config.icon;

  return (
    <Card className="border-dashed" data-testid={`empty-state-${type}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-medium mb-1" data-testid="text-empty-title">
          {title || config.defaultTitle}
        </h3>
        
        <p className="text-sm text-muted-foreground max-w-xs mb-6" data-testid="text-empty-message">
          {message || config.defaultMessage}
        </p>
        
        {(actionHref || onAction) && (
          onAction ? (
            <Button onClick={onAction} variant="outline" data-testid="button-empty-action">
              {actionLabel}
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href={actionHref} data-testid="link-empty-action">
                {actionLabel}
              </Link>
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
}
