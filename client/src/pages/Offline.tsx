import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, RefreshCw, Loader2 } from 'lucide-react';

export default function Offline() {
  const { t } = useLanguage();
  const [isChecking, setIsChecking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      window.location.href = '/';
    }
  }, [isOnline]);

  const handleRetry = async () => {
    setIsChecking(true);
    
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-store' 
      });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md" data-testid="card-offline">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mb-6 animate-pulse">
            <WifiOff className="w-10 h-10 text-warning" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" data-testid="text-offline-title">
            {t.errors.offline}
          </h1>
          
          <p className="text-muted-foreground max-w-xs mb-8" data-testid="text-offline-message">
            {t.errors.offlineMessage}
          </p>
          
          <div className="space-y-4 w-full max-w-xs">
            <Button 
              onClick={handleRetry} 
              disabled={isChecking}
              className="w-full"
              data-testid="button-retry-connection"
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {t.errors.tryAgain}
            </Button>
            
            <div className="text-xs text-muted-foreground">
              <p>Troubleshooting tips:</p>
              <ul className="list-disc text-left pl-4 mt-2 space-y-1">
                <li>Check your WiFi or mobile data connection</li>
                <li>Try turning airplane mode off and on</li>
                <li>Move closer to your router</li>
                <li>Restart your device</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
