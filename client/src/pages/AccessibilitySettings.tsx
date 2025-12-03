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
  Accessibility, Eye, Volume2, Type, Contrast, 
  MousePointer, Keyboard, RotateCcw, Save
} from "lucide-react";
import type { Category } from "@shared/schema";

interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  autoplayVideos: boolean;
  mutedByDefault: boolean;
  colorBlindMode: string;
  cursorSize: string;
  focusIndicator: boolean;
}

const STORAGE_KEY = "blueberry_accessibility";

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  reduceMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  autoplayVideos: false,
  mutedByDefault: false,
  colorBlindMode: "none",
  cursorSize: "default",
  focusIndicator: true,
};

export default function AccessibilitySettings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
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

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    if (settings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "Settings saved",
      description: "Your accessibility preferences have been saved",
    });
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
    setHasChanges(false);
    toast({
      title: "Settings reset",
      description: "Accessibility settings have been reset to defaults",
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
              <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-accessibility-title">
                <Accessibility className="w-8 h-8 text-primary" />
                Accessibility
              </h1>
              <p className="text-muted-foreground mt-1">
                Customize your experience for better accessibility
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Visual
                </CardTitle>
                <CardDescription>
                  Adjust visual settings for better readability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Font Size
                    </Label>
                    <span className="text-sm text-muted-foreground">{settings.fontSize}%</span>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    min={75}
                    max={150}
                    step={5}
                    onValueChange={([val]) => updateSetting("fontSize", val)}
                    data-testid="slider-font-size"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="flex items-center gap-2 cursor-pointer">
                    <Contrast className="w-4 h-4" />
                    <div>
                      <p>High Contrast</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Increase color contrast for better visibility
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="high-contrast"
                    checked={settings.highContrast}
                    onCheckedChange={(val) => updateSetting("highContrast", val)}
                    data-testid="switch-high-contrast"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Color Blind Mode</Label>
                  <Select
                    value={settings.colorBlindMode}
                    onValueChange={(val) => updateSetting("colorBlindMode", val)}
                  >
                    <SelectTrigger data-testid="select-colorblind">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="protanopia">Protanopia (Red-weak)</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia (Green-weak)</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia (Blue-weak)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Cursor Size</Label>
                  <Select
                    value={settings.cursorSize}
                    onValueChange={(val) => updateSetting("cursorSize", val)}
                  >
                    <SelectTrigger data-testid="select-cursor-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  Motion & Animation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reduce-motion" className="flex items-center gap-2 cursor-pointer">
                    <div>
                      <p>Reduce Motion</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Minimize animations and transitions
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="reduce-motion"
                    checked={settings.reduceMotion}
                    onCheckedChange={(val) => updateSetting("reduceMotion", val)}
                    data-testid="switch-reduce-motion"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboard-nav" className="flex items-center gap-2 cursor-pointer">
                    <div>
                      <p>Enhanced Keyboard Navigation</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Improved focus management for keyboard users
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="keyboard-nav"
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(val) => updateSetting("keyboardNavigation", val)}
                    data-testid="switch-keyboard-nav"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="focus-indicator" className="flex items-center gap-2 cursor-pointer">
                    <div>
                      <p>Focus Indicator</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Show visible focus ring on interactive elements
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="focus-indicator"
                    checked={settings.focusIndicator}
                    onCheckedChange={(val) => updateSetting("focusIndicator", val)}
                    data-testid="switch-focus-indicator"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="screen-reader" className="flex items-center gap-2 cursor-pointer">
                    <div>
                      <p>Screen Reader Optimization</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Optimize content for screen readers
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReader}
                    onCheckedChange={(val) => updateSetting("screenReader", val)}
                    data-testid="switch-screen-reader"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoplay" className="flex items-center gap-2 cursor-pointer">
                    <div>
                      <p>Autoplay Videos</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Automatically play videos when viewing
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="autoplay"
                    checked={settings.autoplayVideos}
                    onCheckedChange={(val) => updateSetting("autoplayVideos", val)}
                    data-testid="switch-autoplay"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="muted-default" className="flex items-center gap-2 cursor-pointer">
                    <div>
                      <p>Muted by Default</p>
                      <p className="text-xs text-muted-foreground font-normal">
                        Start videos muted
                      </p>
                    </div>
                  </Label>
                  <Switch
                    id="muted-default"
                    checked={settings.mutedByDefault}
                    onCheckedChange={(val) => updateSetting("mutedByDefault", val)}
                    data-testid="switch-muted-default"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                data-testid="button-reset-accessibility"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex-1"
                data-testid="button-save-accessibility"
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
