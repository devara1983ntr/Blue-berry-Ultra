import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserPreferences, watchHistoryService, favoritesService, watchLaterService } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, ArrowLeft, Settings, Heart, Clock, History,
  Eye, LogOut, Shield, Bell, Moon, Palette, Video
} from "lucide-react";

export default function Profile() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
  const [historyCount, setHistoryCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [watchLaterCount, setWatchLaterCount] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      if (isAuthenticated && user) {
        const history = await watchHistoryService.get(user.id);
        const favorites = await favoritesService.get(user.id);
        const watchLater = await watchLaterService.get(user.id);
        
        setHistoryCount(history.length);
        setFavoritesCount(favorites.length);
        setWatchLaterCount(watchLater.length);
      } else {
        const historyStored = localStorage.getItem('blueberry_watch_history');
        const favoritesStored = localStorage.getItem('blueberry_favorites');
        const watchLaterStored = localStorage.getItem('blueberry_watch_later');
        
        setHistoryCount(historyStored ? JSON.parse(historyStored).length : 0);
        setFavoritesCount(favoritesStored ? JSON.parse(favoritesStored).length : 0);
        setWatchLaterCount(watchLaterStored ? JSON.parse(watchLaterStored).length : 0);
      }
    };
    
    loadStats();
  }, [isAuthenticated, user]);

  const handleDarkModeChange = async (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    if (isAuthenticated && user) {
      await updateUserPreferences(user.id, { darkMode: enabled });
    }
  };

  const handleAutoplayChange = async (enabled: boolean) => {
    setAutoplay(enabled);
    if (isAuthenticated && user) {
      await updateUserPreferences(user.id, { autoplay: enabled });
    }
  };

  const handleNotificationsChange = async (enabled: boolean) => {
    setNotifications(enabled);
    if (isAuthenticated && user) {
      await updateUserPreferences(user.id, { notifications: enabled });
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          onMenuClick={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center px-4 max-w-md">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Sign in to view your profile</h2>
            <p className="text-muted-foreground mb-6">
              Access your watch history, favorites, and personalized settings
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/login">{t.common.login}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/register">{t.common.register}</Link>
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onMenuClick={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 pt-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-profile-title">
              Profile
            </h1>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="text-3xl bg-primary/20">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl font-bold">{user?.username}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      Member
                    </Badge>
                    {user?.createdAt && (
                      <Badge variant="outline">
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button variant="outline" asChild className="flex-shrink-0">
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card 
              className="cursor-pointer hover-elevate" 
              onClick={() => navigate('/history')}
              data-testid="card-history-stats"
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <History className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{historyCount}</p>
                <p className="text-sm text-muted-foreground">Videos Watched</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover-elevate" 
              onClick={() => navigate('/favorites')}
              data-testid="card-favorites-stats"
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-3xl font-bold">{favoritesCount}</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover-elevate" 
              onClick={() => navigate('/watch-later')}
              data-testid="card-watch-later-stats"
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">{watchLaterCount}</p>
                <p className="text-sm text-muted-foreground">Watch Later</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="preferences">
            <TabsList className="mb-4">
              <TabsTrigger value="preferences" data-testid="tab-preferences">
                <Palette className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="playback" data-testid="tab-playback">
                <Video className="w-4 h-4 mr-2" />
                Playback
              </TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Use dark theme</p>
                      </div>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={handleDarkModeChange}
                      data-testid="switch-dark-mode"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="playback">
              <Card>
                <CardHeader>
                  <CardTitle>Video Settings</CardTitle>
                  <CardDescription>Configure video playback behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Autoplay</p>
                        <p className="text-sm text-muted-foreground">Play next video automatically</p>
                      </div>
                    </div>
                    <Switch
                      checked={autoplay}
                      onCheckedChange={handleAutoplayChange}
                      data-testid="switch-autoplay"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={handleNotificationsChange}
                      data-testid="switch-notifications"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
