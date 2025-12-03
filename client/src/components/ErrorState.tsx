import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Search, WifiOff, ServerCrash, FileX } from 'lucide-react';
import { Link } from 'wouter';

interface ErrorStateProps {
  type?: 'general' | 'notFound' | 'offline' | 'server' | 'empty';
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
}

export function ErrorState({ 
  type = 'general', 
  title, 
  message, 
  onRetry, 
  showHomeButton = true 
}: ErrorStateProps) {
  const { t } = useLanguage();

  const configs = {
    general: {
      icon: AlertTriangle,
      iconColor: 'text-destructive',
      defaultTitle: t.errors.somethingWentWrong,
      defaultMessage: 'An unexpected error occurred. Please try again.',
    },
    notFound: {
      icon: FileX,
      iconColor: 'text-muted-foreground',
      defaultTitle: t.errors.pageNotFound,
      defaultMessage: 'The page you are looking for does not exist or has been moved.',
    },
    offline: {
      icon: WifiOff,
      iconColor: 'text-warning',
      defaultTitle: t.errors.offline,
      defaultMessage: t.errors.offlineMessage,
    },
    server: {
      icon: ServerCrash,
      iconColor: 'text-destructive',
      defaultTitle: 'Server Error',
      defaultMessage: 'Our servers are experiencing issues. Please try again later.',
    },
    empty: {
      icon: Search,
      iconColor: 'text-muted-foreground',
      defaultTitle: t.common.noResults,
      defaultMessage: 'Try adjusting your search or filters to find what you are looking for.',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Card className="max-w-md mx-auto" data-testid={`error-state-${type}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 ${config.iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2" data-testid="text-error-title">
          {title || config.defaultTitle}
        </h3>
        
        <p className="text-sm text-muted-foreground max-w-xs mb-6" data-testid="text-error-message">
          {message || config.defaultMessage}
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} data-testid="button-retry">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t.errors.tryAgain}
            </Button>
          )}
          
          {showHomeButton && (
            <Button variant="outline" asChild>
              <Link href="/" data-testid="link-go-home">
                <Home className="w-4 h-4 mr-2" />
                {t.errors.goHome}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
