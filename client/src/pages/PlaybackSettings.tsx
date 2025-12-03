import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SideDrawer } from "@/components/SideDrawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { 
  Play, Volume2, Monitor, Gauge, RotateCcw, Save, 
  Maximize, Repeat, FastForward, Rewind, SkipForward
} from "lucide-react";
import type { Category } from "@shared/schema";

interface PlaybackSettings {
  defaultQuality: string;
  autoplay: boolean;
  autoplayNext: boolean;
  defaultVolume: number;
  defaultPlaybackRate: number;
  theaterModeDefault: boolean;
  showProgressBar: boolean;
  rememberPosition: boolean;
  skipIntroEnabled: boolean;
  skipIntroDuration: number;
  loopVideo: boolean;
  hideControls: boolean;
  hideControlsDelay: number;
}

const STORAGE_KEY = "blueberry_playback_settings";

const defaultSettings: PlaybackSettings = {
  defaultQuality: "auto",
  autoplay: false,
  autoplayNext: true,
  defaultVolume: 80,
  defaultPlaybackRate: 1,
  theaterModeDefault: false,
  showProgressBar: true,
  rememberPosition: true,
  skipIntroEnabled: false,
  skipIntroDuration: 30,
  loopVideo: false,
  hideControls: true,
  hideControlsDelay: 3,
};

const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const qualityOptions = ["auto", "1080p", "720p", "480p", "360p"];

export default function PlaybackSettings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<PlaybackSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSetting = <K extends keyof PlaybackSettings>(
    key: K,
    value: PlaybackSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "Settings saved",
      description: "Your playback preferences have been saved",
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
    setHasChanges(false);
    toast({
      title: "Settings reset",
      description: "Playback settings have been reset to defaults",
    });
  };

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

      <main className="flex-1 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-playback-title">
                <Play className="w-8 h-8 text-primary" />
                Playback Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure video playback preferences
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Quality & Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Default Video Quality</Label>
                  <Select
                    value={settings.defaultQuality}
                    onValueChange={(val) => updateSetting("defaultQuality", val)}
                  >
                    <SelectTrigger data-testid="select-quality">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {qualityOptions.map((q) => (
                        <SelectItem key={q} value={q}>
                          {q === "auto" ? "Auto (Recommended)" : q}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="theater-default" className="cursor-pointer">
                    <div>
                      <p>Theater Mode by Default</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Open videos in theater mode
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="theater-default"
                    checked={settings.theaterModeDefault}
                    onCheckedChange={(val) => updateSetting("theaterModeDefault", val)}
                    data-testid="switch-theater-default"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-progress" className="cursor-pointer">
                    <div>
                      <p>Show Progress Bar</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Display video progress in thumbnails
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="show-progress"
                    checked={settings.showProgressBar}
                    onCheckedChange={(val) => updateSetting("showProgressBar", val)}
                    data-testid="switch-show-progress"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FastForward className="w-5 h-5" />
                  Autoplay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoplay" className="cursor-pointer">
                    <div>
                      <p>Autoplay Videos</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Automatically start playing when opening a video
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="autoplay"
                    checked={settings.autoplay}
                    onCheckedChange={(val) => updateSetting("autoplay", val)}
                    data-testid="switch-autoplay"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="autoplay-next" className="cursor-pointer">
                    <div>
                      <p>Autoplay Next Video</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Play related videos automatically after a video ends
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="autoplay-next"
                    checked={settings.autoplayNext}
                    onCheckedChange={(val) => updateSetting("autoplayNext", val)}
                    data-testid="switch-autoplay-next"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="loop" className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4" />
                      <div>
                        <p>Loop Video</p>
                        <p className="text-xs text-muted-foreground font-normal">
                          Repeat the video when it ends
                        </p>
                      </div>
                    </div>
                  </Label>
                  <Switch
                    id="loop"
                    checked={settings.loopVideo}
                    onCheckedChange={(val) => updateSetting("loopVideo", val)}
                    data-testid="switch-loop"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Audio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Default Volume</Label>
                    <span className="text-sm text-muted-foreground">{settings.defaultVolume}%</span>
                  </div>
                  <Slider
                    value={[settings.defaultVolume]}
                    min={0}
                    max={100}
                    onValueChange={([val]) => updateSetting("defaultVolume", val)}
                    data-testid="slider-volume"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5" />
                  Speed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-3 block">Default Playback Speed</Label>
                  <Select
                    value={settings.defaultPlaybackRate.toString()}
                    onValueChange={(val) => updateSetting("defaultPlaybackRate", parseFloat(val))}
                  >
                    <SelectTrigger data-testid="select-playback-rate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {playbackRates.map((rate) => (
                        <SelectItem key={rate} value={rate.toString()}>
                          {rate === 1 ? "Normal" : `${rate}x`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SkipForward className="w-5 h-5" />
                  Skip & Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remember-position" className="cursor-pointer">
                    <div>
                      <p>Remember Playback Position</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Continue where you left off
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="remember-position"
                    checked={settings.rememberPosition}
                    onCheckedChange={(val) => updateSetting("rememberPosition", val)}
                    data-testid="switch-remember-position"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="skip-intro" className="cursor-pointer">
                    <div>
                      <p>Skip Intro</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Show skip intro button at start of videos
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="skip-intro"
                    checked={settings.skipIntroEnabled}
                    onCheckedChange={(val) => updateSetting("skipIntroEnabled", val)}
                    data-testid="switch-skip-intro"
                  />
                </div>

                {settings.skipIntroEnabled && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Skip Duration</Label>
                      <span className="text-sm text-muted-foreground">{settings.skipIntroDuration}s</span>
                    </div>
                    <Slider
                      value={[settings.skipIntroDuration]}
                      min={5}
                      max={120}
                      step={5}
                      onValueChange={([val]) => updateSetting("skipIntroDuration", val)}
                      data-testid="slider-skip-duration"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Maximize className="w-5 h-5" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-controls" className="cursor-pointer">
                    <div>
                      <p>Auto-hide Controls</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Hide player controls after inactivity
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="hide-controls"
                    checked={settings.hideControls}
                    onCheckedChange={(val) => updateSetting("hideControls", val)}
                    data-testid="switch-hide-controls"
                  />
                </div>

                {settings.hideControls && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Hide After</Label>
                      <span className="text-sm text-muted-foreground">{settings.hideControlsDelay}s</span>
                    </div>
                    <Slider
                      value={[settings.hideControlsDelay]}
                      min={1}
                      max={10}
                      onValueChange={([val]) => updateSetting("hideControlsDelay", val)}
                      data-testid="slider-hide-delay"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                data-testid="button-reset-playback"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex-1"
                data-testid="button-save-playback"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
