import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import type { Language } from '@/lib/i18n/translations';

interface LanguageSelectorProps {
  variant?: 'icon' | 'full';
}

export function LanguageSelector({ variant = 'icon' }: LanguageSelectorProps) {
  const { language, setLanguage, languageNames, availableLanguages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={variant === 'icon' ? 'icon' : 'default'}
          className="gap-2"
          data-testid="button-language-selector"
        >
          <Globe className="w-4 h-4" />
          {variant === 'full' && <span>{languageNames[language]}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" data-testid="menu-language-options">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={language === lang ? 'bg-accent' : ''}
            data-testid={`menu-item-language-${lang}`}
          >
            <span className="font-medium">{languageNames[lang]}</span>
            {language === lang && (
              <span className="ml-auto text-xs text-muted-foreground">Active</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
