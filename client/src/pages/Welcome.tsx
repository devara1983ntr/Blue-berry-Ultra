import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/context/LanguageContext';
import { useAgeVerification } from '@/context/AgeVerificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Play, Heart, Settings, ChevronRight, ChevronLeft, Sparkles, Shield, Bookmark, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  icon: typeof Play;
  titleKey: 'step1Title' | 'step2Title' | 'step3Title' | 'step4Title';
  messageKey: 'step1Message' | 'step2Message' | 'step3Message' | 'step4Message';
  color: string;
}

const steps: OnboardingStep[] = [
  {
    icon: Play,
    titleKey: 'step1Title',
    messageKey: 'step1Message',
    color: 'text-blue-500',
  },
  {
    icon: Heart,
    titleKey: 'step2Title',
    messageKey: 'step2Message',
    color: 'text-pink-500',
  },
  {
    icon: Bookmark,
    titleKey: 'step3Title',
    messageKey: 'step3Message',
    color: 'text-purple-500',
  },
  {
    icon: Settings,
    titleKey: 'step4Title',
    messageKey: 'step4Message',
    color: 'text-green-500',
  },
];

export default function Welcome() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { setHasSeenWelcome, hasSeenWelcome } = useAgeVerification();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (hasSeenWelcome) {
      navigate('/');
    }
  }, [hasSeenWelcome, navigate]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setHasSeenWelcome(true);
    navigate('/');
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted flex flex-col">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {currentStep === 0 && (
          <div className="text-center mb-8 animate-in fade-in duration-500">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2" data-testid="text-welcome-title">
              {t.onboarding.welcome}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.onboarding.welcomeMessage}
            </p>
          </div>
        )}

        <Card className="w-full max-w-md" data-testid="card-onboarding">
          <CardContent className="p-8">
            <div className="mb-6">
              <Progress value={progress} className="h-1" data-testid="progress-onboarding" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>

            <div className="text-center space-y-6 animate-in fade-in duration-300" key={currentStep}>
              <div className={`w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center ${steps[currentStep].color}`}>
                <CurrentIcon className="w-8 h-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-2" data-testid="text-step-title">
                  {t.onboarding[steps[currentStep].titleKey]}
                </h2>
                <p className="text-muted-foreground" data-testid="text-step-message">
                  {t.onboarding[steps[currentStep].messageKey]}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                data-testid="button-previous"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                variant="ghost"
                onClick={handleSkip}
                data-testid="button-skip"
              >
                {t.onboarding.skip}
              </Button>

              <Button onClick={handleNext} data-testid="button-next">
                {currentStep === steps.length - 1 ? (
                  <>
                    {t.onboarding.getStarted}
                    <Sparkles className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    {t.common.next}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 mt-6">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
              data-testid={`dot-step-${index}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 text-center text-xs text-muted-foreground">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
}
