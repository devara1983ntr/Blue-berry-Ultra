import { useState } from 'react';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings2, X } from 'lucide-react';
import { Link } from 'wouter';

export function CookieConsentBanner() {
  const { showBanner, acceptAll, acceptNecessary, savePreferences, preferences } = useCookieConsent();
  const { t } = useLanguage();
  const [showCustomize, setShowCustomize] = useState(false);
  const [customPrefs, setCustomPrefs] = useState(preferences);

  if (!showBanner) return null;

  const handleSaveCustom = () => {
    savePreferences(customPrefs);
    setShowCustomize(false);
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent"
      data-testid="banner-cookie-consent"
    >
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-4 md:p-6">
          {!showCustomize ? (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-full bg-primary/10 shrink-0">
                  <Cookie className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm" data-testid="text-cookie-title">
                    {t.cookies.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t.cookies.message}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomize(true)}
                  className="flex-1 md:flex-none"
                  data-testid="button-customize-cookies"
                >
                  <Settings2 className="w-4 h-4 mr-1" />
                  {t.cookies.customize}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={acceptNecessary}
                  className="flex-1 md:flex-none"
                  data-testid="button-accept-necessary"
                >
                  {t.cookies.acceptNecessary}
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="flex-1 md:flex-none"
                  data-testid="button-accept-all-cookies"
                >
                  {t.cookies.acceptAll}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t.cookies.customize}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCustomize(false)}
                  data-testid="button-close-customize"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="font-medium">Necessary</Label>
                    <p className="text-xs text-muted-foreground">Required for the website to function</p>
                  </div>
                  <Switch checked disabled data-testid="switch-necessary-cookies" />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="font-medium">Analytics</Label>
                    <p className="text-xs text-muted-foreground">Help us improve our services</p>
                  </div>
                  <Switch
                    checked={customPrefs.analytics}
                    onCheckedChange={(checked) => setCustomPrefs(prev => ({ ...prev, analytics: checked }))}
                    data-testid="switch-analytics-cookies"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="font-medium">Marketing</Label>
                    <p className="text-xs text-muted-foreground">Personalized advertisements</p>
                  </div>
                  <Switch
                    checked={customPrefs.marketing}
                    onCheckedChange={(checked) => setCustomPrefs(prev => ({ ...prev, marketing: checked }))}
                    data-testid="switch-marketing-cookies"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="font-medium">Personalization</Label>
                    <p className="text-xs text-muted-foreground">Remember your preferences</p>
                  </div>
                  <Switch
                    checked={customPrefs.personalization}
                    onCheckedChange={(checked) => setCustomPrefs(prev => ({ ...prev, personalization: checked }))}
                    data-testid="switch-personalization-cookies"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <Link 
                  href="/privacy" 
                  className="text-xs text-primary hover:underline"
                  data-testid="link-privacy-policy"
                >
                  {t.cookies.privacyPolicy}
                </Link>
                <Button onClick={handleSaveCustom} data-testid="button-save-cookie-preferences">
                  {t.common.save}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
