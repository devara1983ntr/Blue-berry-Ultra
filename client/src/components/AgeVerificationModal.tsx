import { useAgeVerification } from '@/context/AgeVerificationContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export function AgeVerificationModal() {
  const { isVerified, verifyAge, exitSite } = useAgeVerification();
  const { t } = useLanguage();

  if (isVerified) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      data-testid="modal-age-verification"
    >
      <Card className="max-w-md w-full bg-gradient-to-b from-card to-background border-destructive/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold" data-testid="text-age-verification-title">
            {t.ageVerification.title}
          </CardTitle>
          <CardDescription className="text-lg text-destructive flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {t.ageVerification.warning}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center leading-relaxed" data-testid="text-age-verification-details">
            {t.ageVerification.warningDetails}
          </p>
          
          <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              {t.ageVerification.disclaimer}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button 
            onClick={verifyAge}
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6 font-semibold"
            size="lg"
            data-testid="button-confirm-age"
          >
            {t.ageVerification.confirmButton}
          </Button>
          <Button 
            onClick={exitSite}
            variant="outline"
            className="w-full"
            size="lg"
            data-testid="button-exit-site"
          >
            {t.ageVerification.exitButton}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
