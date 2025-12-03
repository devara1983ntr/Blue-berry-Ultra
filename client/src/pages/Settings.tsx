import { useState } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/LanguageSelector';
import { 
  ArrowLeft, Settings as SettingsIcon, Moon, Sun, Play, Monitor,
  Bell, Mail, Shield, Trash2, LogOut, User, ChevronRight
} from 'lucide-react';

export default function Settings() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();

  const [darkMode, setDarkMode] = useState(() => 
    document.documentElement.classList.contains('dark')
  );
  const [autoplay, setAutoplay] = useState(true);
  const [quality, setQuality] = useState('auto');
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('blueberry_watch_history');
    toast({
      title: 'History cleared',
      description: 'Your watch history has been cleared.',
    });
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-settings-title">
              {t.settings.title}
            </h1>
            <p className="text-sm text-muted-foreground">Manage your preferences</p>
          </div>
        </div>

        {isAuthenticated && user && (
          <Card data-testid="card-profile">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Button variant="outline" size="sm" data-testid="button-edit-profile">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card data-testid="card-appearance">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              {t.settings.appearance}
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <Label htmlFor="darkMode">{t.settings.darkMode}</Label>
              </div>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={handleDarkModeChange}
                data-testid="switch-dark-mode"
              />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-playback">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Playback
            </CardTitle>
            <CardDescription>Video playback preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="autoplay">{t.settings.autoplay}</Label>
              <Switch
                id="autoplay"
                checked={autoplay}
                onCheckedChange={setAutoplay}
                data-testid="switch-autoplay"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label>{t.settings.quality}</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="w-32" data-testid="select-quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="360p">360p</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-language">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              {t.settings.languageSettings}
            </CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label>{t.common.language}</Label>
              <LanguageSelector variant="full" />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-notifications">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              {t.settings.notifications}
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <Label htmlFor="push">{t.settings.pushNotifications}</Label>
              </div>
              <Switch
                id="push"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                data-testid="switch-push-notifications"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <Label htmlFor="email">{t.settings.emailNotifications}</Label>
              </div>
              <Switch
                id="email"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                data-testid="switch-email-notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-privacy">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              {t.settings.privacy}
            </CardTitle>
            <CardDescription>Privacy and data settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={handleClearHistory}
              data-testid="button-clear-history"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                {t.settings.clearHistory}
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {isAuthenticated && (
              <>
                <Separator />
                <Button
                  variant="outline"
                  className="w-full justify-between text-destructive hover:text-destructive"
                  data-testid="button-delete-account"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    {t.settings.deleteAccount}
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-legal">
          <CardHeader>
            <CardTitle>Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between" asChild>
              <Link href="/privacy" data-testid="link-privacy-settings">
                {t.legal.privacyPolicy}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <Link href="/terms" data-testid="link-terms-settings">
                {t.legal.termsOfService}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <Link href="/about" data-testid="link-about-settings">
                {t.legal.aboutUs}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {isAuthenticated && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.common.logout}
          </Button>
        )}

        <div className="text-center text-xs text-muted-foreground py-4">
          <p>Blueberry v1.0.0</p>
          <p className="mt-1">&copy; 2024 Blueberry. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
