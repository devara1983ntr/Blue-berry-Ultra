import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, Settings, Video, Star, MessageCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'video' | 'update' | 'system' | 'recommendation';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'video',
    title: 'New video added',
    message: 'A new trending video has been added to your favorite category.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    actionUrl: '/',
  },
  {
    id: '2',
    type: 'recommendation',
    title: 'Recommended for you',
    message: 'Based on your watch history, you might enjoy these new videos.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    actionUrl: '/',
  },
  {
    id: '3',
    type: 'system',
    title: 'Welcome to Blueberry',
    message: 'Thank you for joining! Explore our features and personalize your experience.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: '4',
    type: 'update',
    title: 'New features available',
    message: 'Check out the new gesture controls and playback enhancements.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    actionUrl: '/settings',
  },
];

export default function Notifications() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: 'All marked as read',
      description: 'All notifications have been marked as read.',
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: 'Notification deleted',
      description: 'The notification has been removed.',
    });
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast({
      title: 'Notifications cleared',
      description: 'All notifications have been cleared.',
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-500" />;
      case 'recommendation':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'update':
        return <Bell className="w-5 h-5 text-green-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-primary" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" data-testid="button-back-home">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2" data-testid="text-notifications-title">
                <Bell className="w-8 h-8 text-primary" />
                {t.common.notifications}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                data-testid="button-mark-all-read"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/settings" data-testid="link-notification-settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card data-testid="card-empty-notifications">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                You're all caught up! Check back later for updates.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`hover-elevate ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}
                data-testid={`card-notification-${notification.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {notification.actionUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={notification.actionUrl}>View</Link>
                          </Button>
                        )}
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            data-testid={`button-mark-read-${notification.id}`}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark read
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(notification.id)}
                          data-testid={`button-delete-notification-${notification.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {notifications.length > 0 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearAll}
                data-testid="button-clear-all-notifications"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Notifications
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
